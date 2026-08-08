import { Request, Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { writeAuditLog } from '../services/auditLog.service';

/**
 * Public: Get approved reviews for Landing Page
 */
export async function getPublicReviews(req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        author_name as name, 
        role, 
        company_name as company, 
        avatar_url as avatar, 
        rating, 
        feature_tag as feature, 
        review_text as content, 
        likes, 
        status, 
        TO_CHAR(created_at, 'DD/MM/YYYY') as date 
       FROM system_reviews 
       WHERE status = 'APPROVED'
       ORDER BY created_at DESC`
    );

    return sendSuccess(res, result.rows);
  } catch (err: any) {
    console.error('getPublicReviews error:', err);
    return sendError(res, 'Không thể lấy danh sách đánh giá', 500);
  }
}

/**
 * Public: Submit a new review from Landing Page
 */
export async function createPublicReview(req: Request, res: Response) {
  try {
    const { name, role, company, feature, rating, comment, detailedRatings } = req.body;

    if (!name || !comment) {
      return sendError(res, 'Vui lòng nhập Họ tên và Nội dung cảm nhận', 400);
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ];
    const avatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const result = await pool.query(
      `INSERT INTO system_reviews 
        (id, author_name, role, company_name, avatar_url, rating, feature_tag, review_text, likes, status, detailed_ratings, created_at, updated_at)
       VALUES 
        (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 1, 'APPROVED', $8, NOW(), NOW())
       RETURNING 
        id, 
        author_name as name, 
        role, 
        company_name as company, 
        avatar_url as avatar, 
        rating, 
        feature_tag as feature, 
        review_text as content, 
        likes, 
        status, 
        detailed_ratings as "detailedRatings",
        TO_CHAR(created_at, 'DD/MM/YYYY') as date`,
      [
        name.trim(),
        role?.trim() || 'Quản lý',
        company?.trim() || 'Doanh nghiệp SME',
        avatar,
        Number(rating) || 5,
        feature || 'Đánh giá Toàn diện 6 Hạng mục',
        comment.trim(),
        detailedRatings ? JSON.stringify(detailedRatings) : null
      ]
    );

    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(
      null,
      'Landing Page Visitor',
      'Gửi Đánh giá Trải nghiệm UX',
      `${name} (${company || 'SME'}) - ${feature}`,
      ipAddress
    );

    return sendSuccess(res, result.rows[0], 'Đã ghi nhận đánh giá của bạn thành công!');
  } catch (err: any) {
    console.error('createPublicReview error:', err);
    return sendError(res, 'Không thể lưu đánh giá. Vui lòng thử lại.', 500);
  }
}

/**
 * Public: Like a review
 */
export async function likePublicReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE system_reviews SET likes = likes + 1, updated_at = NOW() WHERE id = $1 RETURNING likes`,
      [id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Không tìm thấy đánh giá', 404);
    }

    return sendSuccess(res, { likes: result.rows[0].likes });
  } catch (err: any) {
    console.error('likePublicReview error:', err);
    return sendError(res, 'Không thể thích đánh giá', 500);
  }
}

/**
 * System Admin: Get all reviews with aggregate statistics
 */
export async function getAdminReviews(req: Request, res: Response) {
  try {
    const reviewsRes = await pool.query(
      `SELECT 
        id, 
        author_name as name, 
        role, 
        company_name as company, 
        avatar_url as avatar, 
        rating, 
        feature_tag as feature, 
        review_text as content, 
        likes, 
        status, 
        detailed_ratings as "detailedRatings",
        TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as "createdAt" 
       FROM system_reviews 
       ORDER BY created_at DESC`
    );

    const statsRes = await pool.query(
      `SELECT 
        COUNT(*)::int as "totalReviews",
        ROUND(AVG(rating)::numeric, 1)::float as "avgRating",
        COUNT(CASE WHEN status = 'APPROVED' THEN 1 END)::int as "approvedCount",
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::int as "pendingCount",
        COUNT(CASE WHEN status = 'REJECTED' THEN 1 END)::int as "rejectedCount"
       FROM system_reviews`
    );

    const featureStatsRes = await pool.query(
      `SELECT feature_tag as feature, COUNT(*)::int as count, ROUND(AVG(rating)::numeric, 1)::float as "avgRating"
       FROM system_reviews
       GROUP BY feature_tag
       ORDER BY count DESC`
    );

    return sendSuccess(res, {
      reviews: reviewsRes.rows,
      stats: statsRes.rows[0] || {
        totalReviews: 0,
        avgRating: 5.0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      },
      featureBreakdown: featureStatsRes.rows,
    });
  } catch (err: any) {
    console.error('getAdminReviews error:', err);
    return sendError(res, 'Không thể lấy dữ liệu thống kê đánh giá', 500);
  }
}

/**
 * System Admin: Update review status (APPROVED, REJECTED, PENDING)
 */
export async function updateReviewStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return sendError(res, 'Trạng thái không hợp lệ', 400);
    }

    const result = await pool.query(
      `UPDATE system_reviews SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Không tìm thấy đánh giá', 404);
    }

    return sendSuccess(res, result.rows[0], 'Cập nhật trạng thái đánh giá thành công');
  } catch (err: any) {
    console.error('updateReviewStatus error:', err);
    return sendError(res, 'Không thể cập nhật trạng thái', 500);
  }
}

/**
 * System Admin: Delete review
 */
export async function deleteReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM system_reviews WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return sendError(res, 'Không tìm thấy đánh giá', 404);
    }

    return sendSuccess(res, { id }, 'Đã xóa đánh giá thành công');
  } catch (err: any) {
    console.error('deleteReview error:', err);
    return sendError(res, 'Không thể xóa đánh giá', 500);
  }
}
