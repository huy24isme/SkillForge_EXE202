import React, { useState } from 'react';
import { Target, Plus, Layers } from 'lucide-react';
import { KpiTemplate, BscTemplate } from '../types';

interface TemplateMasterDataProps {
  kpiTemplates: KpiTemplate[];
  bscTemplates: BscTemplate[];
  onAddKpi: (kpi: Omit<KpiTemplate, 'id'>) => void;
  onAddBsc: (bsc: Omit<BscTemplate, 'id'>) => void;
}

export const TemplateMasterData: React.FC<TemplateMasterDataProps> = ({
  kpiTemplates,
  bscTemplates,
  onAddKpi,
  onAddBsc,
}) => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'bsc'>('kpi');
  const [showAddModal, setShowAddModal] = useState(false);

  // New KPI Form State
  const [newKpi, setNewKpi] = useState({
    department: 'Kinh doanh (Sales)',
    name: '',
    target: '',
    unit: 'Phần trăm (%)',
    frequency: 'monthly' as KpiTemplate['frequency'],
    description: '',
  });

  // New BSC Form State
  const [newBsc, setNewBsc] = useState({
    industry: 'Phát triển Phần mềm & CNTT',
    perspective: 'Financial' as BscTemplate['perspective'],
    objective: '',
    description: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'kpi') {
      if (!newKpi.name || !newKpi.target) {
        alert('Vui lòng nhập tên KPI và chỉ tiêu mẫu!');
        return;
      }
      onAddKpi(newKpi);
      // Reset form
      setNewKpi({
        department: 'Kinh doanh (Sales)',
        name: '',
        target: '',
        unit: 'Phần trăm (%)',
        frequency: 'monthly',
        description: '',
      });
    } else {
      if (!newBsc.objective) {
        alert('Vui lòng nhập mục tiêu chiến lược mẫu!');
        return;
      }
      onAddBsc(newBsc);
      // Reset form
      setNewBsc({
        industry: 'Phát triển Phần mềm & CNTT',
        perspective: 'Financial',
        objective: '',
        description: '',
      });
    }
    setShowAddModal(false);
  };

  const getPerspectiveLabel = (p: BscTemplate['perspective']) => {
    switch (p) {
      case 'Financial': return 'Tài chính (Financial)';
      case 'Customer': return 'Khách hàng (Customer)';
      case 'Internal Process': return 'Quy trình nội bộ (Internal Process)';
      case 'Learning & Growth': return 'Học hỏi & Phát triển (Learning & Growth)';
      default: return p;
    }
  };

  const getPerspectiveColor = (p: BscTemplate['perspective']) => {
    switch (p) {
      case 'Financial': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Customer': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Internal Process': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Learning & Growth': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Toggle tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === 'kpi'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Thư viện KPI theo Phòng ban
          </button>
          <button
            onClick={() => setActiveTab('bsc')}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === 'bsc'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            Khung BSC theo Ngành nghề
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'kpi' ? 'Thêm KPI mẫu mới' : 'Thêm BSC mẫu mới'}
        </button>
      </div>

      {/* Grid Content */}
      {activeTab === 'kpi' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiTemplates.map(kpi => (
            <div
              key={kpi.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[10px]">
                    {kpi.department}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize font-medium">
                    Chu kỳ: {kpi.frequency === 'monthly' ? 'Tháng' : kpi.frequency === 'quarterly' ? 'Quý' : 'Năm'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {kpi.name}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                  {kpi.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col gap-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Đơn vị đo:</span>
                  <span className="font-semibold text-slate-700">{kpi.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chỉ tiêu mẫu:</span>
                  <span className="font-bold text-slate-800">{kpi.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bscTemplates.map(bsc => (
            <div
              key={bsc.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[10px] truncate max-w-[180px]">
                    {bsc.industry}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-lg border font-bold text-[10px] ${getPerspectiveColor(bsc.perspective)}`}>
                    {bsc.perspective}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  Mục tiêu: {bsc.objective}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                  {bsc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-medium">
                Khía cạnh: {getPerspectiveLabel(bsc.perspective)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Modal for Adding Templates */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {activeTab === 'kpi' ? 'Thêm KPI mẫu cho Phòng ban' : 'Thêm BSC chiến lược mẫu'}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {activeTab === 'kpi' ? (
                // KPI Form Fields
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Phòng ban áp dụng</label>
                    <select
                      value={newKpi.department}
                      onChange={e => setNewKpi(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="Kinh doanh (Sales)">Kinh doanh (Sales)</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Nhân sự (HR)">Nhân sự (HR)</option>
                      <option value="Công nghệ thông tin (IT)">Công nghệ thông tin (IT)</option>
                      <option value="Tài chính (Finance)">Tài chính (Finance)</option>
                      <option value="Vận hành (Operations)">Vận hành (Operations)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Tên chỉ số KPI mẫu</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Tỷ lệ khách hàng quay lại mua hàng"
                      value={newKpi.name}
                      onChange={e => setNewKpi(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase">Đơn vị đo</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Phần trăm (%)"
                        value={newKpi.unit}
                        onChange={e => setNewKpi(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase">Chu kỳ đánh giá</label>
                      <select
                        value={newKpi.frequency}
                        onChange={e => setNewKpi(prev => ({ ...prev, frequency: e.target.value as KpiTemplate['frequency'] }))}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option value="monthly">Theo tháng</option>
                        <option value="quarterly">Theo quý</option>
                        <option value="yearly">Theo năm</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Chỉ tiêu định mức mẫu (Target)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Tối thiểu 40%"
                      value={newKpi.target}
                      onChange={e => setNewKpi(prev => ({ ...prev, target: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Mô tả chi tiết và công thức tính</label>
                    <textarea
                      rows={3}
                      placeholder="Công thức: (Số khách mua lại / Tổng khách hàng) * 100..."
                      value={newKpi.description}
                      onChange={e => setNewKpi(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                    />
                  </div>
                </>
              ) : (
                // BSC Form Fields
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Nhóm ngành áp dụng</label>
                    <select
                      value={newBsc.industry}
                      onChange={e => setNewBsc(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="Phát triển Phần mềm & CNTT">Phát triển Phần mềm & CNTT</option>
                      <option value="Bán lẻ & Thương mại điện tử">Bán lẻ & Thương mại điện tử</option>
                      <option value="Sản xuất & Vận tải hành khách">Sản xuất & Vận tải hành khách</option>
                      <option value="Ngân hàng & Bảo hiểm">Ngân hàng & Bảo hiểm</option>
                      <option value="F&B (Nhà hàng & Chuỗi đồ uống)">F&B (Nhà hàng & Chuỗi đồ uống)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Khía cạnh BSC (Perspective)</label>
                    <select
                      value={newBsc.perspective}
                      onChange={e => setNewBsc(prev => ({ ...prev, perspective: e.target.value as BscTemplate['perspective'] }))}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="Financial">Tài chính (Financial)</option>
                      <option value="Customer">Khách hàng (Customer)</option>
                      <option value="Internal Process">Quy trình nội bộ (Internal Process)</option>
                      <option value="Learning & Growth">Học hỏi & Phát triển (Learning & Growth)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Mục tiêu chiến lược mẫu</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Tăng tốc phát hành sản phẩm và chất lượng code"
                      value={newBsc.objective}
                      onChange={e => setNewBsc(prev => ({ ...prev, objective: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Mô tả và Định hướng thực thi</label>
                    <textarea
                      rows={4}
                      placeholder="Định hướng: Áp dụng phương thức phát triển linh hoạt Agile/Scrum..."
                      value={newBsc.description}
                      onChange={e => setNewBsc(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/10 transition-colors"
                >
                  Lưu Thư viện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
