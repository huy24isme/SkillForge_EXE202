import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { mockUsers, roleHomePath } from '@/auth/mockUsers'
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { FloatingContactButtons } from '@/components/FloatingContactButtons'

export function LoginPage() {
  const { login, isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const demoAccounts = [
    { label: 'CEO', email: 'ceo@skillforge.vn', role: 'leadership' },
    { label: 'Trưởng phòng', email: 'head@skillforge.vn', role: 'pm' },
    { label: 'Nhân viên', email: 'emp@skillforge.vn', role: 'employee' },
    { label: 'Quản trị viên', email: 'admin@skillforge.vn', role: 'admin' },
    { label: 'SaaS Admin', email: 'saas@skillforge.vn', role: 'saas-admin' },
  ]

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('123456')
    setError('')
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    // Brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 400))

    const result = login({ email, password })
    if (!result.success) {
      setError(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.')
      setIsLoading(false)
      return
    }

    const matched = mockUsers.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() || acc.username.toLowerCase() === email.trim().toLowerCase()
    )

    if (matched) {
      navigate(roleHomePath[matched.role], { replace: true })
    } else {
      navigate('/leadership/executive', { replace: true })
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">
        {/* ── Bright gradient background (Matching Frontend) ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFF 40%, #EFF6FF 70%, #F0FDF4 100%)',
          }}
        />

        {/* Soft Radial Orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)',
            top: '-20%',
            left: '-15%',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(60,80,224,0.10) 0%, transparent 65%)',
            bottom: '-15%',
            right: '-10%',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)',
            top: '30%',
            right: '15%',
          }}
        />

        {/* Back to landing page header */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-slate-200 text-sm font-medium text-slate-700 hover:text-[#3C50E0] hover:border-[#3C50E0]/30 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* ── Card Container ── */}
        <div className="relative z-10 w-full max-w-md my-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logoSkill.png" alt="SkillForge" className="w-20 h-20 object-contain mb-1 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-[#1C2434] tracking-tight">SkillForge</h1>
            <p className="text-sm text-[#64748B] mt-0.5 font-medium">BSC Management System</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-slate-200/60">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1C2434]">Đăng nhập</h2>
              <p className="text-sm text-[#64748B] mt-1">Nhập thông tin để truy cập hệ thống</p>
            </div>

            {/* Logged in notification banner */}
            {isAuthenticated && user && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <p className="text-emerald-800 font-semibold mb-2">
                  ✓ Đang đăng nhập: <span className="font-bold">{user.displayName || user.email}</span> ({user.role})
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(roleHomePath[user.role], { replace: true })}
                    className="flex-1 py-2 px-3 bg-[#3C50E0] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-[#3142C4] transition-colors"
                  >
                    <span>Vào Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="py-2 px-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-[#1C2434] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ceo@skillforge.vn"
                  required
                  autoFocus
                  autoComplete="email"
                  className="w-full px-4 py-3 text-sm text-[#1C2434] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none placeholder:text-[#94A3B8] transition-all duration-200 focus:border-[#3C50E0] focus:ring-2 focus:ring-[#3C50E0]/10 focus:bg-white"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#1C2434]">Mật khẩu</label>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-11 text-sm text-[#1C2434] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none placeholder:text-[#94A3B8] transition-all duration-200 focus:border-[#3C50E0] focus:ring-2 focus:ring-[#3C50E0]/10 focus:bg-white"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors p-1"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Accounts Card (Frontend Synchronized) */}
              <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-4 text-xs text-blue-900 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#1C2434] text-xs">Tài khoản demo hệ thống</p>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono font-medium">
                    Pass: 123456
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Bấm chọn tài khoản bên dưới để tự động điền:</p>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickFill(acc.email)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                        email === acc.email
                          ? 'bg-white border-[#3C50E0] text-[#3C50E0] shadow-sm font-semibold'
                          : 'bg-white/60 border-slate-200/70 hover:bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs">{acc.label}</span>
                      <code className="text-[11px] font-mono text-slate-500">{acc.email}</code>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden text-white shadow-md ${
                  isLoading
                    ? 'bg-[#3C50E0]/60 cursor-not-allowed'
                    : 'bg-[#3C50E0] hover:bg-[#3142C4] active:scale-[0.99] shadow-[#3C50E0]/30 hover:shadow-lg hover:shadow-[#3C50E0]/40'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-[#94A3B8] mt-6">
            © 2026 SkillForge · Balanced Scorecard Management System
          </p>
        </div>
      </div>
      <FloatingContactButtons />
    </>
  )
}

