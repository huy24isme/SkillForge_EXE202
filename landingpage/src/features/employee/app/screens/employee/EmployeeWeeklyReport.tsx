import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Plus,
  Save,
  Send,
  Target,
  Trash2,
  UserCheck,
} from 'lucide-react';

type WeeklyStatus = 'Draft' | 'Submitted' | 'Reviewed' | 'NeedRevision';

type WeeklyReportHistoryItem = {
  id: string;
  weekRange: string;
  projectFocus: string;
  submittedAt: string;
  highlights: number;
  blockers: number;
  status: WeeklyStatus;
  managerFeedback?: string;
};

type WeeklyFormData = {
  weekStart: string;
  weekEnd: string;
  projectFocus: string;
  highlights: string[];
  blockers: string[];
  supportNeeded: string;
  nextWeekPlan: string[];
  workload: 'Balanced' | 'Busy' | 'Overloaded';
  confidence: 'High' | 'Medium' | 'Low';
};

const INITIAL_FORM_DATA: WeeklyFormData = {
  weekStart: '',
  weekEnd: '',
  projectFocus: '',
  highlights: [''],
  blockers: [''],
  supportNeeded: '',
  nextWeekPlan: [''],
  workload: 'Balanced',
  confidence: 'Medium',
};

const INITIAL_HISTORY: WeeklyReportHistoryItem[] = [
  {
    id: 'emp-wk-2026-09',
    weekRange: '24/02 - 01/03',
    projectFocus: 'E-Commerce Platform v2.0',
    submittedAt: '2026-03-01T17:30:00',
    highlights: 3,
    blockers: 1,
    status: 'Reviewed',
    managerFeedback: 'Báo cáo rõ ràng, tuần tới ưu tiên xử lý dứt điểm issue checkout mobile.',
  },
  {
    id: 'emp-wk-2026-08',
    weekRange: '17/02 - 23/02',
    projectFocus: 'E-Commerce Platform v2.0',
    submittedAt: '2026-02-23T17:11:00',
    highlights: 4,
    blockers: 0,
    status: 'Submitted',
  },
  {
    id: 'emp-wk-2026-07',
    weekRange: '10/02 - 16/02',
    projectFocus: 'Checkout Revamp',
    submittedAt: '2026-02-16T16:46:00',
    highlights: 2,
    blockers: 2,
    status: 'NeedRevision',
    managerFeedback: 'Bổ sung rõ tác động blocker để PM điều phối nguồn lực nhanh hơn.',
  },
];

function statusLabel(status: WeeklyStatus) {
  if (status === 'Draft') return 'Nháp';
  if (status === 'Submitted') return 'Đã nộp';
  if (status === 'Reviewed') return 'Đã duyệt';
  return 'Cần bổ sung';
}

function statusClass(status: WeeklyStatus) {
  if (status === 'Draft') return 'bg-gray-100 text-gray-700 border-gray-200';
  if (status === 'Submitted') return 'bg-[#3AE7E1]/10 text-[#0B1C2D] border-[#3AE7E1]/30';
  if (status === 'Reviewed') return 'bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/30';
  return 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30';
}

function formatDateTime(raw: string) {
  const dt = new Date(raw);
  return dt.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EmployeeWeeklyReport() {
  const [formData, setFormData] = useState<WeeklyFormData>(INITIAL_FORM_DATA);
  const [reportHistory, setReportHistory] = useState<WeeklyReportHistoryItem[]>(INITIAL_HISTORY);
  const [showSaved, setShowSaved] = useState(false);
  const [showSubmitted, setShowSubmitted] = useState(false);

  const completion = useMemo(() => {
    let score = 0;
    if (formData.weekStart) score += 1;
    if (formData.weekEnd) score += 1;
    if (formData.projectFocus.trim()) score += 1;
    if (formData.highlights.some((item) => item.trim())) score += 1;
    if (formData.nextWeekPlan.some((item) => item.trim())) score += 1;
    if (formData.supportNeeded.trim()) score += 1;
    return Math.round((score / 6) * 100);
  }, [formData]);

  const isValid =
    !!formData.weekStart &&
    !!formData.weekEnd &&
    !!formData.projectFocus.trim() &&
    formData.highlights.some((item) => item.trim()) &&
    formData.nextWeekPlan.some((item) => item.trim());

  const updateListItem = (
    field: 'highlights' | 'blockers' | 'nextWeekPlan',
    index: number,
    value: string,
  ) => {
    const items = [...formData[field]];
    items[index] = value;
    setFormData({ ...formData, [field]: items });
  };

  const addListItem = (field: 'highlights' | 'blockers' | 'nextWeekPlan') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeListItem = (field: 'highlights' | 'blockers' | 'nextWeekPlan', index: number) => {
    if (formData[field].length === 1) {
      return;
    }
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const flashSaved = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1800);
  };

  const handleSaveDraft = () => {
    flashSaved();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    const submittedItem: WeeklyReportHistoryItem = {
      id: `emp-wk-${Date.now()}`,
      weekRange: `${formData.weekStart} - ${formData.weekEnd}`,
      projectFocus: formData.projectFocus,
      submittedAt: new Date().toISOString(),
      highlights: formData.highlights.filter((x) => x.trim()).length,
      blockers: formData.blockers.filter((x) => x.trim()).length,
      status: 'Submitted',
    };

    setReportHistory((prev) => [submittedItem, ...prev]);
    setShowSubmitted(true);
    setTimeout(() => setShowSubmitted(false), 2500);
    setFormData(INITIAL_FORM_DATA);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {showSubmitted && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-xl px-6 py-4 shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Đã nộp báo cáo tuần cho PM thành công.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Báo cáo tuần</h2>
              <p className="text-sm text-gray-600 mt-1">
                Tổng hợp kết quả, blocker và kế hoạch tuần tới để PM điều phối nguồn lực.
              </p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full border border-gray-200 bg-gray-50 text-gray-700">
              Hoàn thiện: {completion}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu tuần *</label>
              <input
                type="date"
                value={formData.weekStart}
                onChange={(e) => setFormData({ ...formData, weekStart: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc tuần *</label>
              <input
                type="date"
                value={formData.weekEnd}
                onChange={(e) => setFormData({ ...formData, weekEnd: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dự án/công việc trọng tâm *</label>
            <input
              type="text"
              value={formData.projectFocus}
              onChange={(e) => setFormData({ ...formData, projectFocus: e.target.value })}
              placeholder="VD: E-Commerce Platform v2.0 - Checkout module"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
            />
          </div>

          <section className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#3AE7E1]" />
              Kết quả đạt được trong tuần *
            </h3>
            <div className="space-y-2">
              {formData.highlights.map((item, index) => (
                <div key={`hl-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    onChange={(e) => updateListItem('highlights', index, e.target.value)}
                    rows={2}
                    placeholder={`Kết quả ${index + 1}: Hoàn thành..., cải thiện...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('highlights', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Xoa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem('highlights')}
              className="mt-3 text-sm text-[#0B1C2D] font-medium inline-flex items-center gap-1.5 hover:text-[#3AE7E1]"
            >
              <Plus className="w-4 h-4" /> Them ket qua
            </button>
          </section>

          <section className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-[#F5A623]" />
              Blocker/rui ro trong tuan
            </h3>
            <div className="space-y-2">
              {formData.blockers.map((item, index) => (
                <div key={`bl-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    onChange={(e) => updateListItem('blockers', index, e.target.value)}
                    rows={2}
                    placeholder={`Blocker ${index + 1}: Dang cho... / can...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('blockers', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Xoa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem('blockers')}
              className="mt-3 text-sm text-[#0B1C2D] font-medium inline-flex items-center gap-1.5 hover:text-[#3AE7E1]"
            >
              <Plus className="w-4 h-4" /> Them blocker
            </button>
          </section>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ho tro can PM/Team *</label>
            <textarea
              value={formData.supportNeeded}
              onChange={(e) => setFormData({ ...formData, supportNeeded: e.target.value })}
              rows={3}
              placeholder="Can review gap, ho tro test du lieu, hoac bo tri them nguon luc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
            />
          </div>

          <section className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-[#3AE7E1]" />
              Ke hoach tuan toi *
            </h3>
            <div className="space-y-2">
              {formData.nextWeekPlan.map((item, index) => (
                <div key={`np-${index}`} className="flex items-start gap-2">
                  <textarea
                    value={item}
                    onChange={(e) => updateListItem('nextWeekPlan', index, e.target.value)}
                    rows={2}
                    placeholder={`Ke hoach ${index + 1}: Hoan thanh..., phoi hop...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('nextWeekPlan', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Xoa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem('nextWeekPlan')}
              className="mt-3 text-sm text-[#0B1C2D] font-medium inline-flex items-center gap-1.5 hover:text-[#3AE7E1]"
            >
              <Plus className="w-4 h-4" /> Them ke hoach
            </button>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tai cong viec</label>
              <select
                value={formData.workload}
                onChange={(e) =>
                  setFormData({ ...formData, workload: e.target.value as WeeklyFormData['workload'] })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Balanced">Can bang</option>
                <option value="Busy">Ban ron</option>
                <option value="Overloaded">Qua tai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Muc do tu tin tien do</label>
              <select
                value={formData.confidence}
                onChange={(e) =>
                  setFormData({ ...formData, confidence: e.target.value as WeeklyFormData['confidence'] })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="High">Cao</option>
                <option value="Medium">Trung binh</option>
                <option value="Low">Thap</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Luu nhap
            </button>

            <button
              type="submit"
              disabled={!isValid}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Nop bao cao tuan
            </button>
          </div>

          {showSaved && (
            <p className="text-sm text-[#0B1C2D]">Da luu nhap bao cao tuan.</p>
          )}
        </form>

        <div className="space-y-6">
          <section className="bg-gradient-to-br from-[#0B1C2D] to-[#1E3A5F] text-white rounded-xl p-5">
            <h3 className="font-semibold mb-4">Weekly Snapshot</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Da nop dung han</span>
                <span className="font-semibold text-[#3AE7E1]">6 tuan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Can bo sung</span>
                <span className="font-semibold text-[#F5A623]">1 tuan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Blocker dang mo</span>
                <span className="font-semibold text-[#E74C3C]">2</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3AE7E1]" /> Lich su bao cao tuan
            </h3>
            <div className="space-y-3">
              {reportHistory.map((item) => (
                <article key={item.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.projectFocus}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.weekRange}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${statusClass(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-gray-600 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Target className="w-3 h-3" /> {item.highlights} ket qua
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {item.blockers} blocker
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-500 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDateTime(item.submittedAt)}
                  </p>

                  {item.managerFeedback && (
                    <p className="mt-2 text-xs text-[#0B1C2D] bg-[#3AE7E1]/10 rounded p-2 inline-flex items-start gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 mt-0.5" />
                      {item.managerFeedback}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
