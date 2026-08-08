import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/features/pm/app/components/ui/badge';
import { ChevronDown, ChevronRight, CalendarDays, ClipboardList, Lightbulb, Plus, Download } from 'lucide-react';
import { downloadWeeklyReportPdf } from '@/features/pm/app/utils/weeklyReportPdf';

type ProjectStatus = 'Good' | 'Monitoring' | 'Risk';

type WeeklyMember = {
  name: string;
  summary: string;
  reportsSubmitted: string;
};

type WeeklyReportItem = {
  id: string;
  projectName: string;
  weekRange: string;
  progressSummary: string[];
  members: WeeklyMember[];
  projectEvaluation: {
    status: ProjectStatus;
    reason: string;
  };
  memberEvaluation: {
    performingWell: string[];
    overloaded: string[];
    lateReports: string[];
  };
  recommendations: string[];
};

const weeklyReports: WeeklyReportItem[] = [
  {
    id: 'wk-2026-02-16',
    projectName: 'E-Commerce Platform v2.0',
    weekRange: '16/02 - 22/02',
    progressSummary: [
      'Hoàn thành refactor luồng thanh toán và giảm thời gian tải trang 18%.',
      'Hoàn tất test tích hợp cho cổng thanh toán và xử lý các ca test không ổn định.',
      'API backend cho luật giảm giá đã sẵn sàng, nhưng giao diện admin cấu hình luật vẫn đang chờ hoàn thiện.',
      'Tính năng xuất đơn hàng đã xong, đang chờ PM xác nhận trước khi phát hành.',
    ],
    members: [
      {
        name: 'Nguyễn Văn A',
        summary: 'Dẫn dắt tích hợp frontend cho luồng thanh toán và review mã cho 2 PR. Hỗ trợ QA xử lý các lỗi biên liên quan đến cập nhật giỏ hàng.',
        reportsSubmitted: '5/5',
      },
      {
        name: 'Lê Hồng Đức',
        summary: 'Hoàn thành các endpoint cho engine giảm giá và tối ưu độ trễ truy vấn cơ sở dữ liệu khi tra cứu khuyến mãi.',
        reportsSubmitted: '4/5',
      },
      {
        name: 'Trần Thị B',
        summary: 'Hoàn thiện cập nhật giao diện responsive cho trang thanh toán trên mobile và cập nhật đặc tả thiết kế cho các trang chiến dịch.',
        reportsSubmitted: '5/5',
      },
    ],
    projectEvaluation: {
      status: 'Good',
      reason: 'Các mục tiêu cốt lõi của sprint đã đạt được và chỉ số chất lượng được cải thiện. Các hạng mục còn lại rủi ro thấp và đã có người phụ trách.',
    },
    memberEvaluation: {
      performingWell: ['Nguyễn Văn A', 'Trần Thị B'],
      overloaded: ['Lê Hồng Đức'],
      lateReports: ['Lê Hồng Đức'],
    },
    recommendations: [
      'Chuyển 1 đầu việc backend từ Lê Hồng Đức để giảm rủi ro nghẽn trong tuần tới.',
      'Lên lịch một buổi sync QA ngắn giữa tuần để tăng tốc phân loại lỗi.',
      'Chốt tiêu chí nghiệm thu cho UI admin trước phiên lập kế hoạch sprint.',
    ],
  },
  {
    id: 'wk-2026-02-23',
    projectName: 'Mobile Banking App',
    weekRange: '23/02 - 01/03',
    progressSummary: [
      'Đã triển khai đăng nhập sinh trắc học cho Android và hoàn tất kiểm thử hồi quy cho xác thực iOS.',
      'Đã xử lý 2 phát hiện bảo mật từ phân tích tĩnh trong luồng làm mới token.',
      'Phân trang lịch sử giao dịch đã hoàn thành, nhưng phần thiết kế lại cài đặt thông báo vẫn chưa xong.',
      'Bản release candidate đã sẵn sàng và đang chờ rà soát checklist tuân thủ cuối cùng.',
    ],
    members: [
      {
        name: 'Phạm Văn C',
        summary: 'Thực hiện xử lý phiên bảo mật và vá các lỗi biên quan trọng trong logic hết hạn token. Phối hợp cùng đội bảo mật để hoàn thiện ghi chú khắc phục.',
        reportsSubmitted: '5/5',
      },
      {
        name: 'Hoàng Minh K',
        summary: 'Triển khai dịch vụ tùy chọn thông báo đẩy và sửa các sai lệch contract API ở phần cài đặt người dùng.',
        reportsSubmitted: '3/5',
      },
      {
        name: 'Đỗ Thu N',
        summary: 'Hoàn thiện UI cho danh sách giao dịch và chuẩn bị ghi chú UX cho các cải tiến khả năng truy cập.',
        reportsSubmitted: '5/5',
      },
    ],
    projectEvaluation: {
      status: 'Monitoring',
      reason: 'Bảo mật và chức năng cốt lõi đang đúng tiến độ, nhưng kỷ luật báo cáo và một hạng mục UI bị trễ cần theo dõi sát.',
    },
    memberEvaluation: {
      performingWell: ['Phạm Văn C', 'Đỗ Thu N'],
      overloaded: ['Phạm Văn C'],
      lateReports: ['Hoàng Minh K'],
    },
    recommendations: [
      'Phân công thêm người phụ trách phụ cho phần cài đặt thông báo để tránh tràn việc sang sprint sau.',
      'Thiết lập nhắc nhở tự động cho báo cáo hằng ngày để cải thiện tính nhất quán khi báo cáo.',
    ],
  },
];

function statusLabel(status: ProjectStatus) {
  if (status === 'Good') return 'Tốt';
  if (status === 'Monitoring') return 'Theo dõi';
  return 'Rủi ro';
}

function statusBadgeClass(status: ProjectStatus) {
  if (status === 'Good') {
    return 'bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/30';
  }
  if (status === 'Monitoring') {
    return 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30';
  }
  return 'bg-[#E74C3C]/15 text-[#E74C3C] border-[#E74C3C]/30';
}

export function WeeklyReport() {
  const navigate = useNavigate();
  const [openIds, setOpenIds] = useState<string[]>([weeklyReports[0].id]);

  const toggleSection = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Báo cáo tuần</h2>
            <p className="text-sm text-gray-600">Báo cáo dự án theo tuần kèm trạng thái, đánh giá dự án và đánh giá thành viên.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-[#0B1C2D] border-gray-300 bg-gray-50">
              {weeklyReports.length} tuần
            </Badge>
            <button
              onClick={() => navigate('/pm/create-weekly-report')}
              className="flex items-center gap-2 px-4 py-2 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#34d3cd] transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Tạo báo cáo tuần
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {weeklyReports.map((weekly) => {
          const isOpen = openIds.includes(weekly.id);

          return (
            <section key={weekly.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(weekly.id)}
                className="w-full px-6 py-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-left space-y-2">
                  <p className="text-sm text-gray-500">Dự án: <span className="font-medium text-gray-900">{weekly.projectName}</span></p>
                  <p className="text-sm text-gray-500">Tuần: <span className="font-medium text-gray-900">{weekly.weekRange}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusBadgeClass(weekly.projectEvaluation.status)}>
                    {statusLabel(weekly.projectEvaluation.status)}
                  </Badge>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 space-y-5 border-t border-gray-100">
                  <div className="pt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        downloadWeeklyReportPdf({
                          projectName: weekly.projectName,
                          weekRange: weekly.weekRange,
                          progressSummary: weekly.progressSummary,
                          members: weekly.members,
                          projectStatusLabel: statusLabel(weekly.projectEvaluation.status),
                          projectReason: weekly.projectEvaluation.reason,
                          memberEvaluation: weekly.memberEvaluation,
                          recommendations: weekly.recommendations,
                        })
                      }
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#0B1C2D] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Tải xuống PDF
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-5">
                    <div className="lg:col-span-2 rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className="w-4 h-4 text-[#3AE7E1]" />
                        <h3 className="font-semibold text-gray-900">Tổng kết tiến độ (Tuần)</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                        {weekly.progressSummary.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ClipboardList className="w-4 h-4 text-[#3AE7E1]" />
                        <h3 className="font-semibold text-gray-900">Đánh giá dự án</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Trạng thái:</p>
                      <Badge className={`${statusBadgeClass(weekly.projectEvaluation.status)} mb-3`}>
                        {statusLabel(weekly.projectEvaluation.status)}
                      </Badge>
                      <p className="text-sm text-gray-600 mb-1">Lý do:</p>
                      <p className="text-sm text-gray-700">{weekly.projectEvaluation.reason}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Thành viên (Tuần)</h3>
                    <div className="space-y-3">
                      {weekly.members.map((member) => (
                        <div key={member.name} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">{member.name}:</span> {member.summary}
                            <span className="text-gray-500"> | Báo cáo đã nộp: {member.reportsSubmitted}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Đánh giá thành viên</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Làm tốt:</span> {weekly.memberEvaluation.performingWell.join(', ') || 'Không có'}</p>
                        <p><span className="font-medium">Quá tải:</span> {weekly.memberEvaluation.overloaded.join(', ') || 'Không có'}</p>
                        <p><span className="font-medium">Nộp trễ báo cáo:</span> {weekly.memberEvaluation.lateReports.join(', ') || 'Không có'}</p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-[#F5A623]" />
                        <h3 className="font-semibold text-gray-900">Khuyến nghị</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                        {weekly.recommendations.map((rec) => (
                          <li key={rec}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}