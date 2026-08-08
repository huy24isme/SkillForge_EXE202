import { useState } from 'react';
import { CalendarDays, FileText, ClipboardList, TrendingUp, Download } from 'lucide-react';
import { downloadWeeklyReportPdf } from '@/features/pm/app/utils/weeklyReportPdf';

type ProjectStatus = 'Good' | 'Monitoring' | 'Risk';
type TabKey = 'overview' | 'members' | 'reports' | 'tasks';

const project = {
  name: 'E-Commerce Platform v2.0',
  description:
    'Hiện đại hóa nền tảng bán hàng với độ ổn định thanh toán cao hơn, quản lý chiến dịch hiệu quả hơn và khả năng theo dõi phân tích rõ ràng cho đội vận hành.',
  status: 'Monitoring' as ProjectStatus,
  startDate: '2026-01-10',
  deadline: '2026-03-25',
};

const teamMembers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    role: 'Trưởng nhóm Frontend',
    contribution:
      'Dẫn dắt tái cấu trúc giao diện thanh toán và đồng bộ kiến trúc front-end với hợp đồng API. Giảm lỗi hồi quy UI nhờ siết chặt tiêu chuẩn review component.',
  },
  {
    id: 2,
    name: 'Lê Hồng Đức',
    role: 'Lập trình viên Backend',
    contribution:
      'Hoàn thiện luồng API thanh toán an toàn khi retry và cải thiện hiệu năng truy vấn giảm giá. Đồng thời xử lý các edge case khi migration ảnh hưởng đến rule chiến dịch.',
  },
  {
    id: 3,
    name: 'Trần Thị B',
    role: 'Thiết kế UI/UX',
    contribution:
      'Cung cấp prototype mới cho luồng chiến dịch và thanh toán với khả năng truy cập tốt hơn. Phối hợp với QA để giảm các lỗi không nhất quán về giao diện.',
  },
  {
    id: 4,
    name: 'Phạm Văn C',
    role: 'Kỹ sư QA',
    contribution:
      'Xây dựng thêm kịch bản kiểm thử hồi quy cho thanh toán và xuất đơn hàng. Phát hiện các edge case nghiêm trọng trước khi đóng gói bản release candidate.',
  },
];

const dailyReports = [
  {
    id: 'dr-01',
    date: '2026-03-06',
    summary:
      'Đã hoàn tất kiểm tra luồng thanh toán và sửa lỗi retry payment. Một phụ thuộc API phân tích vẫn đang bị chặn và cần backend làm rõ.',
  },
  {
    id: 'dr-02',
    date: '2026-03-05',
    summary:
      'Luồng xuất chiến dịch đã qua smoke test của QA. Đội bắt đầu chuẩn bị release note và checklist bàn giao.',
  },
];

const weeklyReports = [
  {
    id: 'wr-01',
    week: '24/02 - 01/03',
    summary:
      'Các cột mốc sprint cốt lõi nhìn chung đang đúng tiến độ. Rủi ro migration backend đã giảm sau khi vá schema và tăng thêm vòng kiểm tra QA.',
  },
  {
    id: 'wr-02',
    week: '17/02 - 23/02',
    summary:
      'Module thanh toán và chiến dịch tiến triển ổn định, nhưng tính nhất quán khi báo cáo của một thành viên vẫn cần theo dõi thêm.',
  },
];

const taskProgress = {
  completed: 36,
  total: 48,
};

const weeklyActivitySummary = [
  'Hoàn thành mục tiêu sprint về độ ổn định checkout và merge 6 PR lên production.',
  'Đóng 11 vấn đề từ QA và không còn lỗi mức độ nghiêm trọng cao đang mở.',
  'Endpoint dashboard phân tích bị chậm do phụ thuộc API liên đội.',
  'Chuẩn bị xong checklist release candidate và kế hoạch rollback khi triển khai.',
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

export function ProjectDetails() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const completionRate = Math.round((taskProgress.completed / taskProgress.total) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Chi tiết dự án</h2>
            <p className="text-sm text-gray-600 mt-1">Màn hình theo dõi dự án chi tiết dành cho quản lý dự án.</p>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusBadgeClass(project.status)}`}>
            {statusLabel(project.status)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview' ? 'bg-white text-[#0B1C2D] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Tổng quan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'members' ? 'bg-white text-[#0B1C2D] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Thành viên
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'reports' ? 'bg-white text-[#0B1C2D] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Báo cáo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'tasks' ? 'bg-white text-[#0B1C2D] shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Công việc
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan dự án</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-gray-500 mb-1">Tên dự án</p>
              <p className="font-medium text-gray-900">{project.name}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-gray-500 mb-1">Trạng thái</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadgeClass(project.status)}`}>
                {statusLabel(project.status)}
              </span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg md:col-span-2">
              <p className="text-gray-500 mb-1">Mô tả</p>
              <p className="text-gray-800">{project.description}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#3AE7E1]" />
              <div>
                <p className="text-gray-500 mb-1">Ngày bắt đầu</p>
                <p className="font-medium text-gray-900">{new Date(project.startDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#F5A623]" />
              <div>
                <p className="text-gray-500 mb-1">Hạn chót</p>
                <p className="font-medium text-gray-900">{new Date(project.deadline).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thành viên dự án</h3>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{member.role}</span>
                </div>
                <p className="text-sm text-gray-700">{member.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3AE7E1]" /> Báo cáo hằng ngày
            </h3>
            <div className="space-y-3">
              {dailyReports.map((report) => (
                <div key={report.id} className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{new Date(report.date).toLocaleDateString('vi-VN')}</p>
                  <p className="text-sm text-gray-800">{report.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#3AE7E1]" /> Báo cáo tuần
            </h3>
            <div className="space-y-3">
              {weeklyReports.map((report) => (
                <div key={report.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs text-gray-500">Tuần: {report.week}</p>
                    <button
                      type="button"
                      onClick={() =>
                        downloadWeeklyReportPdf({
                          projectName: project.name,
                          weekRange: report.week,
                          summary: report.summary,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#0B1C2D] border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải PDF
                    </button>
                  </div>
                  <p className="text-sm text-gray-800">{report.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theo dõi tiến độ</h3>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Tiến độ hoàn thành công việc</span>
                <span className="font-medium text-gray-900">{taskProgress.completed}/{taskProgress.total} ({completionRate}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3AE7E1]" /> Tóm tắt hoạt động tuần
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {weeklyActivitySummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
