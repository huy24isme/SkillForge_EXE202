import { User, Mail, Shield, Bell, Lock, Key } from 'lucide-react';

export function ExecutiveProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3AE7E1] to-[#2563EB] flex items-center justify-center text-[#0B1C2D] text-3xl font-bold border-4 border-slate-50 shadow-lg">
          CEO
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#0B1C2D] mb-1">Nguyễn Văn A</h2>
          <p className="text-slate-500 mb-4">Giám đốc điều hành (CEO)</p>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium flex items-center gap-2">
              <Mail className="w-3 h-3" /> ceo@skillforge.io
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-2">
              <Shield className="w-3 h-3" /> Administrator Access
            </span>
          </div>
        </div>
        <button className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50">
          Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Notification Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-[#3AE7E1]" />
            <h3 className="font-bold text-[#0B1C2D]">Cài đặt thông báo AI</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Cảnh báo rủi ro dự án (Nghiêm trọng)', checked: true },
              { label: 'Báo cáo tóm tắt hằng ngày (Daily Digest)', checked: true },
              { label: 'Thông báo nhân sự quá tải', checked: false },
              { label: 'Đề xuất phê duyệt mới', checked: true },
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                <span className="text-sm text-slate-700">{setting.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={setting.checked} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AE7E1]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-[#3AE7E1]" />
            <h3 className="font-bold text-[#0B1C2D]">Bảo mật</h3>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
               <div className="flex items-center gap-3">
                 <Key className="w-5 h-5 text-slate-400" />
                 <div>
                   <div className="text-sm font-medium text-[#0B1C2D]">Đổi mật khẩu</div>
                   <div className="text-xs text-slate-400">Lần cuối: 3 tháng trước</div>
                 </div>
               </div>
               <button className="text-sm text-blue-600 font-medium hover:underline">Thay đổi</button>
             </div>
             
             <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
               <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-slate-400" />
                 <div>
                   <div className="text-sm font-medium text-[#0B1C2D]">Xác thực 2 lớp (2FA)</div>
                   <div className="text-xs text-green-500 font-bold">Đang bật</div>
                 </div>
               </div>
               <button className="text-sm text-slate-400 font-medium hover:underline">Cấu hình</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
