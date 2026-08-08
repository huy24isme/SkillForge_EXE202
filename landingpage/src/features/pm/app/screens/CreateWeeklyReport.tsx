import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Target, 
  AlertCircle, 
  Lightbulb, 
  Plus, 
  X, 
  Save, 
  Send,
  Eye,
  ChevronRight,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Badge } from '@/features/pm/app/components/ui/badge';

type ProjectStatus = 'Good' | 'Monitoring' | 'Risk';

type MemberInput = {
  id: string;
  name: string;
  summary: string;
  reportsSubmitted: string;
};

type FormData = {
  projectName: string;
  weekStart: string;
  weekEnd: string;
  progressItems: string[];
  members: MemberInput[];
  projectStatus: ProjectStatus;
  projectReason: string;
  performingWell: string[];
  overloaded: string[];
  lateReports: string[];
  recommendations: string[];
};

const INITIAL_FORM_DATA: FormData = {
  projectName: '',
  weekStart: '',
  weekEnd: '',
  progressItems: [''],
  members: [],
  projectStatus: 'Good',
  projectReason: '',
  performingWell: [],
  overloaded: [],
  lateReports: [],
  recommendations: [''],
};

// Mock team members
const TEAM_MEMBERS = [
  { id: '1', name: 'Nguyễn Văn A', role: 'Backend Developer' },
  { id: '2', name: 'Trần Thị B', role: 'Frontend Developer' },
  { id: '3', name: 'Lê Văn C', role: 'Designer' },
  { id: '4', name: 'Phạm Thị D', role: 'QA Engineer' },
  { id: '5', name: 'Hoàng Văn E', role: 'DevOps' },
];

export function CreateWeeklyReport() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 5;

  // Auto-save functionality (simulated)
  const handleAutoSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      console.log('Auto-saved:', formData);
    }, 500);
  };

  const addProgressItem = () => {
    setFormData({ ...formData, progressItems: [...formData.progressItems, ''] });
  };

  const updateProgressItem = (index: number, value: string) => {
    const newItems = [...formData.progressItems];
    newItems[index] = value;
    setFormData({ ...formData, progressItems: newItems });
    handleAutoSave();
  };

  const removeProgressItem = (index: number) => {
    setFormData({ 
      ...formData, 
      progressItems: formData.progressItems.filter((_, i) => i !== index) 
    });
  };

  const addMember = (memberId: string) => {
    const member = TEAM_MEMBERS.find(m => m.id === memberId);
    if (!member) return;
    
    if (formData.members.find(m => m.id === memberId)) return;
    
    setFormData({
      ...formData,
      members: [...formData.members, {
        id: member.id,
        name: member.name,
        summary: '',
        reportsSubmitted: '0/5'
      }]
    });
  };

  const updateMember = (id: string, field: keyof MemberInput, value: string) => {
    setFormData({
      ...formData,
      members: formData.members.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    });
    handleAutoSave();
  };

  const removeMember = (id: string) => {
    setFormData({
      ...formData,
      members: formData.members.filter(m => m.id !== id)
    });
  };

  const addRecommendation = () => {
    setFormData({ ...formData, recommendations: [...formData.recommendations, ''] });
  };

  const updateRecommendation = (index: number, value: string) => {
    const newRecs = [...formData.recommendations];
    newRecs[index] = value;
    setFormData({ ...formData, recommendations: newRecs });
    handleAutoSave();
  };

  const removeRecommendation = (index: number) => {
    setFormData({ 
      ...formData, 
      recommendations: formData.recommendations.filter((_, i) => i !== index) 
    });
  };

  const toggleMemberEvaluation = (list: 'performingWell' | 'overloaded' | 'lateReports', name: string) => {
    const currentList = formData[list];
    const newList = currentList.includes(name)
      ? currentList.filter(n => n !== name)
      : [...currentList, name];
    setFormData({ ...formData, [list]: newList });
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Good': return 'bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/30';
      case 'Monitoring': return 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30';
      case 'Risk': return 'bg-[#E74C3C]/15 text-[#E74C3C] border-[#E74C3C]/30';
    }
  };

  const handleSubmit = () => {
    console.log('Submitting:', formData);
    alert('Báo cáo tuần đã được gửi thành công!');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return formData.projectName && formData.weekStart && formData.weekEnd;
      case 2: return formData.progressItems.some(item => item.trim());
      case 3: return formData.members.length > 0;
      case 4: return formData.projectStatus && formData.projectReason;
      case 5: return formData.recommendations.some(rec => rec.trim());
      default: return false;
    }
  };

  if (showPreview) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại chỉnh sửa</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#34d3cd] transition-colors font-semibold"
            >
              <Send className="w-4 h-4" />
              Gửi báo cáo
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1E3A5F] p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Xem trước báo cáo tuần</h2>
            <p className="text-slate-300">Kiểm tra lại thông tin trước khi gửi</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Project Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Dự án</p>
                <p className="text-xl font-bold text-gray-900">{formData.projectName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Tuần</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.weekStart} - {formData.weekEnd}
                </p>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-slate-50 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#3AE7E1]" />
                Tóm tắt tiến độ (tuần)
              </h3>
              <ul className="space-y-2">
                {formData.progressItems.filter(item => item.trim()).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#3AE7E1] mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Members */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#3AE7E1]" />
                Thành viên (tuần)
              </h3>
              <div className="space-y-3">
                {formData.members.map((member) => (
                  <div key={member.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-gray-900">{member.name}</span>
                      <span className="text-xs text-gray-500">Báo cáo: {member.reportsSubmitted}</span>
                    </div>
                    <p className="text-sm text-gray-600">{member.summary || 'Chưa có mô tả'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Evaluation */}
            <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1E3A5F] rounded-xl p-6 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#3AE7E1]" />
                Đánh giá dự án
              </h3>
              <div className="mb-4">
                <p className="text-sm text-slate-300 mb-2">Trạng thái:</p>
                <Badge className={getStatusColor(formData.projectStatus)}>
                  {formData.projectStatus === 'Good' && 'Tốt'}
                  {formData.projectStatus === 'Monitoring' && 'Theo dõi'}
                  {formData.projectStatus === 'Risk' && 'Rủi ro'}
                </Badge>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                <span className="font-semibold text-white">Lý do: </span>
                {formData.projectReason}
              </p>

              {/* Member Evaluation */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.performingWell.length > 0 && (
                  <div>
                    <div className="text-xs text-[#3AE7E1] font-semibold mb-2 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Làm tốt
                    </div>
                    <div className="text-sm">{formData.performingWell.join(', ')}</div>
                  </div>
                )}
                {formData.overloaded.length > 0 && (
                  <div>
                    <div className="text-xs text-orange-400 font-semibold mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Quá tải
                    </div>
                    <div className="text-sm text-orange-200">{formData.overloaded.join(', ')}</div>
                  </div>
                )}
                {formData.lateReports.length > 0 && (
                  <div>
                    <div className="text-xs text-red-400 font-semibold mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Chậm báo cáo
                    </div>
                    <div className="text-sm text-red-200">{formData.lateReports.join(', ')}</div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <div className="text-xs text-[#3AE7E1] font-semibold mb-2">Khuyến nghị:</div>
                <ul className="space-y-1.5">
                  {formData.recommendations.filter(rec => rec.trim()).map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-[#3AE7E1] mt-1">►</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Tạo báo cáo tuần</h2>
            <p className="text-sm text-gray-600">Điền đầy đủ thông tin để tạo báo cáo tuần của dự án</p>
          </div>
          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                Đang lưu...
              </span>
            )}
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Xem trước
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step < currentStep 
                      ? 'bg-[#2ECC71] text-white' 
                      : step === currentStep 
                        ? 'bg-[#3AE7E1] text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
                </div>
                {step < totalSteps && (
                  <div className={`flex-1 h-1 rounded ${step < currentStep ? 'bg-[#2ECC71]' : 'bg-gray-200'}`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Step 1: Project Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#3AE7E1]/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#3AE7E1]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thông tin dự án</h3>
                <p className="text-sm text-gray-600">Tên dự án và khoảng thời gian báo cáo</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên dự án *
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="VD: E-Commerce Platform v2.0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu tuần *
                </label>
                <input
                  type="date"
                  value={formData.weekStart}
                  onChange={(e) => setFormData({ ...formData, weekStart: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc tuần *
                </label>
                <input
                  type="date"
                  value={formData.weekEnd}
                  onChange={(e) => setFormData({ ...formData, weekEnd: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Progress Summary */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#3AE7E1]/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-[#3AE7E1]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tóm tắt tiến độ</h3>
                <p className="text-sm text-gray-600">3-5 điểm chính về kết quả và vấn đề</p>
              </div>
            </div>

            <div className="space-y-3">
              {formData.progressItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-[#3AE7E1] mt-3">•</span>
                  <textarea
                    value={item}
                    onChange={(e) => updateProgressItem(index, e.target.value)}
                    placeholder={`Điểm ${index + 1}: VD: Hoàn thành refactor luồng thanh toán...`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                    rows={2}
                  />
                  {formData.progressItems.length > 1 && (
                    <button
                      onClick={() => removeProgressItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addProgressItem}
              className="flex items-center gap-2 px-4 py-2 text-[#3AE7E1] hover:bg-[#3AE7E1]/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm điểm tiến độ
            </button>
          </div>
        )}

        {/* Step 3: Members */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#3AE7E1]/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#3AE7E1]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thành viên trong tuần</h3>
                <p className="text-sm text-gray-600">Thêm thành viên và ghi chú đóng góp</p>
              </div>
            </div>

            {/* Add Member Dropdown */}
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thêm thành viên
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addMember(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
              >
                <option value="">-- Chọn thành viên --</option>
                {TEAM_MEMBERS.filter(m => !formData.members.find(fm => fm.id === m.id)).map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Members List */}
            <div className="space-y-4">
              {formData.members.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#3AE7E1] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">{member.name}</span>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={member.summary}
                    onChange={(e) => updateMember(member.id, 'summary', e.target.value)}
                    placeholder="VD: Dẫn dắt tích hợp frontend cho luồng thanh toán và review mã cho 2 PR..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none mb-2"
                    rows={3}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Báo cáo đã nộp:</label>
                    <select
                      value={member.reportsSubmitted}
                      onChange={(e) => updateMember(member.id, 'reportsSubmitted', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      {['0/5', '1/5', '2/5', '3/5', '4/5', '5/5'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {formData.members.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Chưa có thành viên nào. Thêm thành viên để tiếp tục.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Evaluation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#3AE7E1]/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#3AE7E1]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Đánh giá dự án & thành viên</h3>
                <p className="text-sm text-gray-600">Trạng thái dự án và phân loại thành viên</p>
              </div>
            </div>

            {/* Project Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Trạng thái dự án *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Good', 'Monitoring', 'Risk'] as ProjectStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, projectStatus: status })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.projectStatus === status
                        ? status === 'Good' ? 'border-[#2ECC71] bg-[#2ECC71]/5'
                        : status === 'Monitoring' ? 'border-[#F5A623] bg-[#F5A623]/5'
                        : 'border-[#E74C3C] bg-[#E74C3C]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      {status === 'Good' && <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#2ECC71]" />}
                      {status === 'Monitoring' && <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#F5A623]" />}
                      {status === 'Risk' && <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-[#E74C3C]" />}
                      <p className="font-semibold">
                        {status === 'Good' && 'Tốt'}
                        {status === 'Monitoring' && 'Theo dõi'}
                        {status === 'Risk' && 'Rủi ro'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Project Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do đánh giá *
              </label>
              <textarea
                value={formData.projectReason}
                onChange={(e) => setFormData({ ...formData, projectReason: e.target.value })}
                placeholder="VD: Các mục tiêu cốt lõi của sprint đã đạt được..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Member Evaluation */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Phân loại thành viên</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Performing Well */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-green-600" />
                    <h5 className="font-semibold text-green-900">Làm tốt</h5>
                  </div>
                  <div className="space-y-2">
                    {formData.members.map(member => (
                      <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.performingWell.includes(member.name)}
                          onChange={() => toggleMemberEvaluation('performingWell', member.name)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{member.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Overloaded */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h5 className="font-semibold text-orange-900">Quá tải</h5>
                  </div>
                  <div className="space-y-2">
                    {formData.members.map(member => (
                      <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.overloaded.includes(member.name)}
                          onChange={() => toggleMemberEvaluation('overloaded', member.name)}
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{member.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Late Reports */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-red-600" />
                    <h5 className="font-semibold text-red-900">Chậm báo cáo</h5>
                  </div>
                  <div className="space-y-2">
                    {formData.members.map(member => (
                      <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.lateReports.includes(member.name)}
                          onChange={() => toggleMemberEvaluation('lateReports', member.name)}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{member.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Recommendations */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#3AE7E1]/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-[#3AE7E1]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Khuyến nghị</h3>
                <p className="text-sm text-gray-600">Đưa ra 1-3 khuyến nghị cụ thể</p>
              </div>
            </div>

            <div className="space-y-3">
              {formData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-[#3AE7E1] mt-3">►</span>
                  <textarea
                    value={rec}
                    onChange={(e) => updateRecommendation(index, e.target.value)}
                    placeholder={`Khuyến nghị ${index + 1}: VD: Chuyển 1 đầu việc backend để giảm rủi ro...`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                    rows={2}
                  />
                  {formData.recommendations.length > 1 && (
                    <button
                      onClick={() => removeRecommendation(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addRecommendation}
              className="flex items-center gap-2 px-4 py-2 text-[#3AE7E1] hover:bg-[#3AE7E1]/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm khuyến nghị
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAutoSave}
              className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu nháp
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2 px-6 py-3 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#34d3cd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp theo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowPreview(true)}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2 px-6 py-3 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#34d3cd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                Xem trước & Gửi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
