import { useState, useRef } from 'react'
import { User, Lock, Camera, CheckCircle2, AlertCircle, Eye, EyeOff, Save, Shield } from 'lucide-react'
import { useAuthStore, ROLES } from '../../store/authStore.js'
import clsx from 'clsx'

const AVATAR_STORAGE_KEY = 'skillforge-avatar'

function getStoredAvatar() {
  try { return localStorage.getItem(AVATAR_STORAGE_KEY) || null } catch { return null }
}
function saveAvatar(base64) {
  try { localStorage.setItem(AVATAR_STORAGE_KEY, base64) } catch { /* ignore */ }
}

// ── Avatar Upload ─────────────────────────────────────────────────────────────
function AvatarUpload({ user, avatarUrl, onAvatarChange }) {
  const role = ROLES[user?.role]
  const initials = (user?.fullName ?? user?.name ?? '')
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      saveAvatar(base64)
      onAvatarChange(base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden"
          style={{ background: avatarUrl ? 'transparent' : (role?.color ?? '#3C50E0') }}
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            : initials
          }
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          title="Đổi ảnh đại diện"
        >
          <Camera size={20} className="text-white" />
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-800">{user?.fullName ?? user?.name}</p>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white mt-1"
          style={{ background: role?.color ?? '#3C50E0' }}
        >
          <Shield size={9} /> {role?.label}
        </span>
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="text-xs text-[#3C50E0] hover:underline flex items-center gap-1"
      >
        <Camera size={12} /> Thay đổi ảnh
      </button>
    </div>
  )
}

// ── Alert Banner ─────────────────────────────────────────────────────────────
function Alert({ type, message }) {
  if (!message) return null
  const isSuccess = type === 'success'
  return (
    <div className={clsx(
      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
      isSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
    )}>
      {isSuccess
        ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
        : <AlertCircle size={16} className="text-red-500 shrink-0" />
      }
      {message}
    </div>
  )
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ user, avatarUrl, onAvatarChange }) {
  const { updateProfile } = useAuthStore()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [title, setTitle] = useState(user?.title ?? '')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleSave = async () => {
    if (!fullName.trim()) return setFeedback({ type: 'error', message: 'Họ và tên không được để trống' })
    setSaving(true)
    setFeedback(null)
    const result = await updateProfile(fullName.trim(), title.trim())
    setSaving(false)
    setFeedback(result.ok
      ? { type: 'success', message: 'Đã cập nhật hồ sơ thành công!' }
      : { type: 'error', message: result.error ?? 'Cập nhật thất bại' }
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Avatar column */}
      <div className="md:col-span-1 flex justify-center">
        <AvatarUpload user={user} avatarUrl={avatarUrl} onAvatarChange={onAvatarChange} />
      </div>

      {/* Form column */}
      <div className="md:col-span-2 space-y-5">
        <Alert type={feedback?.type} message={feedback?.message} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              id="settings-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/30 focus:border-[#3C50E0] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 mt-1">Email không thể thay đổi</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chức danh</label>
            <input
              id="settings-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Giám đốc điều hành"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/30 focus:border-[#3C50E0] transition-all"
            />
          </div>
        </div>

        <button
          id="settings-save-profile"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] hover:bg-[#3142C4] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Save size={15} />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  )
}

// ── Password Tab ─────────────────────────────────────────────────────────────
function PasswordField({ id, label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/30 focus:border-[#3C50E0] transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  )
}

function SecurityTab() {
  const { changePassword } = useAuthStore()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleChange = async () => {
    if (!currentPw) return setFeedback({ type: 'error', message: 'Nhập mật khẩu hiện tại' })
    if (newPw.length < 6) return setFeedback({ type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    if (newPw !== confirmPw) return setFeedback({ type: 'error', message: 'Xác nhận mật khẩu không khớp' })

    setSaving(true)
    setFeedback(null)
    const result = await changePassword(currentPw, newPw)
    setSaving(false)

    if (result.ok) {
      setFeedback({ type: 'success', message: 'Đã đổi mật khẩu thành công!' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } else {
      setFeedback({ type: 'error', message: result.error ?? 'Đổi mật khẩu thất bại' })
    }
  }

  return (
    <div className="max-w-md space-y-5">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex gap-2">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <span>Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại ở lần sau.</span>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} />

      <PasswordField
        id="settings-current-password"
        label="Mật khẩu hiện tại"
        value={currentPw}
        onChange={setCurrentPw}
        placeholder="••••••••"
      />
      <PasswordField
        id="settings-new-password"
        label="Mật khẩu mới"
        value={newPw}
        onChange={setNewPw}
        placeholder="Tối thiểu 6 ký tự"
      />
      <PasswordField
        id="settings-confirm-password"
        label="Xác nhận mật khẩu mới"
        value={confirmPw}
        onChange={setConfirmPw}
        placeholder="Nhập lại mật khẩu mới"
      />

      {/* Strength indicator */}
      {newPw.length > 0 && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1,2,3,4].map((i) => (
              <div key={i} className={clsx(
                'h-1 flex-1 rounded-full transition-all',
                newPw.length >= i * 3
                  ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-blue-400' : 'bg-emerald-500'
                  : 'bg-slate-100'
              )} />
            ))}
          </div>
          <p className="text-[10px] text-slate-400">
            {newPw.length < 6 ? 'Quá ngắn' : newPw.length < 9 ? 'Yếu' : newPw.length < 12 ? 'Trung bình' : 'Mạnh'}
          </p>
        </div>
      )}

      <button
        id="settings-change-password"
        onClick={handleChange}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] hover:bg-[#3142C4] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
      >
        <Lock size={15} />
        {saving ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',  label: 'Hồ sơ cá nhân', icon: User },
  { id: 'security', label: 'Bảo mật',        icon: Lock },
]

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [avatarUrl, setAvatarUrl] = useState(getStoredAvatar)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C2434]">Cài đặt tài khoản</h1>
        <p className="text-sm text-slate-500 mt-0.5">Quản lý hồ sơ cá nhân và bảo mật tài khoản</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`settings-tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2',
                activeTab === id
                  ? 'text-[#3C50E0] border-[#3C50E0] bg-[#3C50E0]/5'
                  : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-8">
          {activeTab === 'profile' && (
            <ProfileTab user={user} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
          )}
          {activeTab === 'security' && (
            <SecurityTab />
          )}
        </div>
      </div>
    </div>
  )
}
