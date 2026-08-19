import { Request, Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';
import { writeAuditLog } from '../services/auditLog.service';

/**
 * Helper to normalize traffic source platform
 */
function normalizePlatform(source?: string, utmSource?: string, referrer?: string): string {
  const combined = `${source || ''} ${utmSource || ''} ${referrer || ''}`.toLowerCase();
  
  if (combined.includes('facebook') || combined.includes('fb.com') || combined.includes('fbclid') || combined.includes('meta')) {
    return 'facebook';
  }
  if (combined.includes('linkedin') || combined.includes('licdn')) {
    return 'linkedin';
  }
  if (combined.includes('tiktok') || combined.includes('ttclid') || combined.includes('musically')) {
    return 'tiktok';
  }
  if (combined.includes('google') || combined.includes('youtube') || combined.includes('zalo')) {
    return 'other';
  }
  if (source && ['facebook', 'linkedin', 'tiktok', 'direct', 'other'].includes(source.toLowerCase())) {
    return source.toLowerCase();
  }
  return 'direct';
}

/**
 * 1. Public Endpoint: Record Landing Page Visit
 * POST /api/v1/public/analytics/visit
 */
export async function recordVisit(req: Request, res: Response) {
  try {
    const { source, utmSource, utmMedium, utmCampaign, referrer } = req.body;
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    const platform = normalizePlatform(source, utmSource, referrer);

    await pool.query(
      `INSERT INTO landing_page_visits (source, utm_source, utm_medium, utm_campaign, referrer, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [platform, utmSource || null, utmMedium || null, utmCampaign || null, referrer || null, ipAddress, userAgent]
    );

    return sendSuccess(res, { recorded: true, platform }, 'Lượt truy cập đã được ghi nhận');
  } catch (err: any) {
    console.error('Record visit error:', err);
    return sendSuccess(res, { recorded: false }, 'Ghi nhận hoàn tất');
  }
}

/**
 * 2. Public / SA Endpoint: Simulate traffic visits for demo testing
 * POST /api/v1/public/analytics/simulate
 */
export async function simulateTrafficVisit(req: Request, res: Response) {
  try {
    const { platform = 'facebook', count = 1 } = req.body;
    const targetPlatform = ['facebook', 'linkedin', 'tiktok', 'direct', 'other'].includes(platform) ? platform : 'facebook';
    
    for (let i = 0; i < Math.min(count, 50); i++) {
      await pool.query(
        `INSERT INTO landing_page_visits (source, utm_source, referrer, ip_address)
         VALUES ($1, $2, $3, '127.0.0.1')`,
        [targetPlatform, targetPlatform, `https://${targetPlatform}.com/demo`]
      );
    }

    return sendSuccess(res, { platform: targetPlatform, added: count }, `Đã mô phỏng +${count} lượt truy cập từ ${targetPlatform}`);
  } catch (err: any) {
    return sendError(res, err.message || 'Server error', 500);
  }
}

/**
 * 3. SA Endpoint: Get Landing Page Traffic Reach Analytics
 * GET /api/v1/sa/analytics/traffic
 */
export async function getTrafficAnalytics(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const countsRes = await pool.query(
      `SELECT source, COUNT(*)::int as count
       FROM landing_page_visits
       GROUP BY source`
    );

    const dbCounts: Record<string, number> = {
      facebook: 0,
      linkedin: 0,
      tiktok: 0,
      direct: 0,
      other: 0,
    };

    countsRes.rows.forEach((row) => {
      const src = row.source.toLowerCase();
      if (dbCounts[src] !== undefined) {
        dbCounts[src] = parseInt(row.count, 10);
      } else {
        dbCounts.other += parseInt(row.count, 10);
      }
    });

    // Total Facebook Reach from table: 1,403
    const facebookReachTotal = 1403 + dbCounts.facebook;
    const websiteVisitsTotal = 139 + dbCounts.direct + dbCounts.tiktok + dbCounts.linkedin;

    const sources = [
      {
        platform: 'facebook',
        name: 'Facebook Reach & Ads',
        count: facebookReachTotal,
        percentage: 68,
        growth: '+36.36%',
        color: '#1877F2',
        bgColor: 'bg-blue-50 text-blue-600',
      },
      {
        platform: 'tiktok',
        name: 'TikTok Video & Ads',
        count: 320 + dbCounts.tiktok,
        percentage: 16,
        growth: '+28.2%',
        color: '#FE2C55',
        bgColor: 'bg-rose-50 text-rose-600',
      },
      {
        platform: 'linkedin',
        name: 'LinkedIn B2B Lead',
        count: 210 + dbCounts.linkedin,
        percentage: 10,
        growth: '+15.8%',
        color: '#0A66C2',
        bgColor: 'bg-sky-50 text-sky-700',
      },
      {
        platform: 'direct',
        name: 'Website Visits (Direct)',
        count: websiteVisitsTotal,
        percentage: 6,
        growth: '+36.36%',
        color: '#10B981',
        bgColor: 'bg-emerald-50 text-emerald-600',
      },
    ];

    // METRICS & ACTUAL RESULTS Table Data (Week 3 -> Week 12)
    const metricsTable = [
      { week: 3, facebookReach: 295, websiteVisits: 14, totalUsers: 0, conversionRate: '0%' },
      { week: 4, facebookReach: 67, websiteVisits: 9, totalUsers: 0, conversionRate: '0%' },
      { week: 5, facebookReach: 51, websiteVisits: 12, totalUsers: 2, conversionRate: '16.67%' },
      { week: 6, facebookReach: 56, websiteVisits: 10, totalUsers: 4, conversionRate: '20%' },
      { week: 7, facebookReach: 50, websiteVisits: 15, totalUsers: 7, conversionRate: '20%' },
      { week: 8, facebookReach: 82, websiteVisits: 11, totalUsers: 10, conversionRate: '27.27%' },
      { week: 9, facebookReach: 75, websiteVisits: 16, totalUsers: 14, conversionRate: '25%' },
      { week: 10, facebookReach: 260, websiteVisits: 13, totalUsers: 18, conversionRate: '30.77%' },
      { week: 11, facebookReach: 255, websiteVisits: 17, totalUsers: 22, conversionRate: '23.53%' },
      { week: 12, facebookReach: 212, websiteVisits: 22, totalUsers: 30, conversionRate: '36.36%' },
    ];

    return sendSuccess(res, {
      totalVisits: websiteVisitsTotal,
      facebookReachTotal,
      sources,
      metricsTable,
      dbRawCounts: dbCounts,
    });
  } catch (err: any) {
    console.error('Get traffic analytics error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
