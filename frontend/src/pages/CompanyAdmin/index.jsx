import { useState, useEffect, useCallback } from 'react'
import {
  Building2, Users, LayoutGrid, UserPlus, Pencil, Trash2,
  Plus, Save, X, Eye, EyeOff, ChevronDown, RefreshCw,
  CheckCircle2, AlertCircle, Loader2, Shield, Phone, Mail,
  Hash, Palette, BadgeCheck, Ban,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore.js'
import companyService from '../../services/companyService.js'
import departmentService from '../../services/departmentService.js'
import employeeService from '../../services/employeeService.js'

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES = ['CEO', 'DEPARTMENT_HEAD', 'EMPLOYEE', 'COMPANY_ADMIN']
const ROLE_LABELS = {
  CEO: 'Giám đốc (CEO)',
  DEPARTMENT_HEAD: 'Trưởng phòng',
  EMPLOYEE: 'Nhân viên',
  COMPANY_ADMIN: 'Quản trị viên',
}
const DEPT_COLORS = [
  '#3C50E0', '#16a34a', '#dc2626', '#9333ea',
  '#d97706', '#0891b2', '#db2777', '#65a30d',
]

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function Alert({ type, message, onClose }) {
  if (!message) return null
  const ok = type === 'success'
  return (
    <div className={clsx(
      'flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border mb-5 shadow-sm animate-in fade-in slide-in-from-top-2',
      ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
         : 'bg-red-50 text-red-800 border-red-200/60'
    )}>
      {ok ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
           : <AlertCircle  size={18} className="shrink-0 text-red-600 mt-0.5" />}
      <span className="flex-1 leading-relaxed">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 hover:bg-slate-200/50 rounded-md">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 custom-scrollbar">{children}</div>
      </div>
    </div>
  )
}

function FormField({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

function Input({ id, value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <input
      id={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder} disabled={disabled}
      className={clsx(
        'w-full px-4 py-2.5 text-sm border rounded-xl transition-all outline-none',
        disabled
          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
          : 'bg-white border-slate-200 hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 text-slate-800 placeholder:text-slate-400'
      )}
    />
  )
}

// ─── Tab: Company Info ────────────────────────────────────────────────────────
function CompanyTab({ companyId }) {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [form, setForm] = useState({ name: '', taxCode: '', industry: '', size: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await companyService.getById(companyId)
      setCompany(data)
      setForm({ name: data.name ?? '', taxCode: data.taxCode ?? '', industry: data.industry ?? '', size: data.size ?? '' })
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.name.trim()) return setFeedback({ type: 'error', message: 'Tên công ty không được để trống' })
    setSaving(true)
    setFeedback(null)
    try {
      await companyService.update(companyId, form)
      setFeedback({ type: 'success', message: 'Đã cập nhật thông tin công ty!' })
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-[#3C50E0]" /></div>

  return (
    <div className="max-w-3xl">
      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Thông tin cơ bản</h3>
            <p className="text-xs text-slate-500 mt-0.5">Cập nhật hồ sơ công ty để hiển thị trên hệ thống</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <FormField label="Tên công ty" required>
                <Input id="ca-company-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Công ty TNHH ABC" />
              </FormField>
            </div>
            <FormField label="Mã số thuế">
              <Input id="ca-tax-code" value={form.taxCode} onChange={e => setForm(f => ({ ...f, taxCode: e.target.value }))} placeholder="0123456789" />
            </FormField>
            <FormField label="Ngành nghề">
              <Input id="ca-industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="Công nghệ thông tin" />
            </FormField>
            <FormField label="Quy mô">
              <select
                id="ca-size"
                value={form.size}
                onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800"
              >
                <option value="">Chọn quy mô</option>
                <option value="SMALL">Nhỏ (dưới 50 NV)</option>
                <option value="MEDIUM">Vừa (50–200 NV)</option>
                <option value="LARGE">Lớn (trên 200 NV)</option>
              </select>
            </FormField>
          </div>

          {company && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500 font-medium">ID hệ thống:</span>
                <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">{company.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500 font-medium">Trạng thái:</span>
                <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border', 
                  company.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                )}>
                  {company.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                  {company.status}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              id="ca-save-company"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] hover:bg-[#3142C4] disabled:bg-slate-300 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-[#3C50E0]/30"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Departments ─────────────────────────────────────────────────────────
function DepartmentsTab({ companyId }) {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', color: DEPT_COLORS[0], description: '' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await departmentService.listByCompany(companyId)
      setDepartments(data)
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [companyId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ name: '', code: '', color: DEPT_COLORS[0], description: '' })
    setEditTarget(null)
    setModal('create')
  }
  const openEdit = (dept) => {
    setForm({ name: dept.name, code: dept.code ?? '', color: dept.color ?? DEPT_COLORS[0], description: dept.description ?? '' })
    setEditTarget(dept)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name.trim()) return setFeedback({ type: 'error', message: 'Tên phòng ban là bắt buộc' })
    if (!form.code.trim()) return setFeedback({ type: 'error', message: 'Mã phòng ban là bắt buộc' })
    // Department code: uppercase letters, digits, underscores only
    const codeRegex = /^[A-Z0-9_]+$/
    if (!codeRegex.test(form.code.trim())) return setFeedback({ type: 'error', message: 'Mã phòng ban chỉ gồm chữ HOA, số và dấu gạch dưới (vd: SALES, HR_01)' })
    setSaving(true)
    setFeedback(null)
    try {
      const dto = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        color: form.color || DEPT_COLORS[0],
        description: form.description?.trim() || null,
      }
      if (modal === 'create') {
        await departmentService.create(companyId, dto)
        setFeedback({ type: 'success', message: 'Đã tạo phòng ban!' })
      } else {
        await departmentService.update(editTarget.id, dto)
        setFeedback({ type: 'success', message: 'Đã cập nhật phòng ban!' })
      }
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleDelete = async (dept) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa phòng ban "${dept.name}" không? Toàn bộ nhân viên sẽ bị mất liên kết phòng ban.`)) return
    try {
      await departmentService.delete(dept.id)
      setFeedback({ type: 'success', message: 'Đã xóa phòng ban thành công!' })
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Danh sách phòng ban</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý cơ cấu tổ chức và {departments.length} phòng ban hiện có</p>
        </div>
        <button
          id="ca-add-dept"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-all shadow-sm hover:shadow-md focus:ring-4 focus:ring-[#3C50E0]/30"
        >
          <Plus size={16} /> Thêm phòng ban
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 size={32} className="animate-spin text-[#3C50E0] mb-4" />
          <p className="text-sm font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có phòng ban nào</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">Bạn chưa thiết lập cơ cấu tổ chức. Hãy bắt đầu bằng việc thêm phòng ban đầu tiên cho công ty.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors shadow-sm">
            <Plus size={16} /> Thêm phòng ban
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {departments.map(dept => (
            <div key={dept.id} className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#3C50E0]/30 hover:shadow-lg transition-all flex flex-col">
              <div className="flex items-start gap-3.5 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${dept.color ?? '#3C50E0'} 0%, ${dept.color ?? '#3C50E0'}dd 100%)` }}
                >
                  {(dept.name ?? '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="font-bold text-slate-800 text-base truncate" title={dept.name}>{dept.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold rounded uppercase tracking-wider">{dept.code}</span>
                </div>
              </div>
              
              <div className="flex-1 mb-4">
                {dept.description ? (
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{dept.description}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">Không có mô tả</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(dept)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#3C50E0] bg-slate-50 hover:bg-[#3C50E0]/10 py-2 rounded-lg transition-colors"
                >
                  <Pencil size={14} /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(dept)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={14} /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Thêm phòng ban mới' : 'Chỉnh sửa phòng ban'} onClose={() => setModal(null)}>
          <div className="space-y-5">
            <FormField label="Tên phòng ban" required>
              <Input id="dept-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Phòng Kinh doanh" />
            </FormField>
            
            <FormField label="Mã phòng ban" required hint="Dùng để nhận diện nhanh (Chỉ dùng chữ HOA, số và dấu gạch dưới)">
              <Input id="dept-code" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="VD: SALES_01" />
            </FormField>
            
            <FormField label="Màu sắc nhận diện">
              <div className="flex gap-3 flex-wrap p-3 bg-slate-50 rounded-xl border border-slate-100">
                {DEPT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={clsx(
                      'w-8 h-8 rounded-full transition-all flex items-center justify-center', 
                      form.color === c ? 'ring-4 ring-offset-2 scale-110 shadow-sm' : 'hover:scale-110 opacity-70 hover:opacity-100'
                    )}
                    style={{ background: c, '--tw-ring-color': `${c}80` }}
                  >
                    {form.color === c && <CheckCircle2 size={16} className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </FormField>
            
            <FormField label="Mô tả chức năng">
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Phòng ban này phụ trách việc gì?..."
                rows={3}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all resize-none text-slate-800"
              />
            </FormField>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
              <button
                id="dept-save"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:bg-slate-300 transition-all shadow-md hover:shadow-lg"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Đang lưu...' : 'Lưu phòng ban'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Tab: Employees ───────────────────────────────────────────────────────────
function EmployeesTab({ companyId }) {
  const { user } = useAuthStore()
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit' | 'account'
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ departmentId: '', fullName: '', email: '', phone: '', positionTitle: '' })
  const [accountForm, setAccountForm] = useState({ email: '', password: '', role: 'EMPLOYEE' })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [filterDept, setFilterDept] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [emps, depts] = await Promise.all([
        employeeService.listByCompany(companyId),
        departmentService.listByCompany(companyId),
      ])
      setEmployees(emps)
      setDepartments(depts)
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [companyId])

  useEffect(() => { load() }, [load])

  const deptMap = Object.fromEntries(departments.map(d => [d.id, d]))
  const filtered = employees
    .filter(e => (filterDept ? e.departmentId === filterDept : true))
    .filter(e => e.email !== user?.email)

  const openCreate = () => {
    setForm({ departmentId: departments[0]?.id ?? '', fullName: '', email: '', phone: '', positionTitle: '' })
    setEditTarget(null)
    setModal('create')
  }
  const openEdit = (emp) => {
    setForm({ departmentId: emp.departmentId ?? '', fullName: emp.fullName ?? '', email: emp.email ?? '', phone: emp.phone ?? '', positionTitle: emp.positionTitle ?? '' })
    setEditTarget(emp)
    setModal('edit')
  }
  const openAccount = (emp) => {
    setAccountForm({ email: emp.email ?? '', password: '', role: 'EMPLOYEE' })
    setEditTarget(emp)
    setModal('account')
  }

  const handleSave = async () => {
    if (!form.fullName.trim()) return setFeedback({ type: 'error', message: 'Họ tên là bắt buộc' })
    if (form.fullName.trim().length < 2) return setFeedback({ type: 'error', message: 'Họ tên phải có ít nhất 2 ký tự' })
    if (!form.email.trim()) return setFeedback({ type: 'error', message: 'Email là bắt buộc' })
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) return setFeedback({ type: 'error', message: 'Email không đúng định dạng (vd: nhanvien@company.vn)' })
    if (!form.departmentId) return setFeedback({ type: 'error', message: 'Phòng ban là bắt buộc' })
    // Validate phone if entered (Vietnam phone: 10 digits starting with 0)
    if (form.phone && form.phone.trim()) {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/
      if (!phoneRegex.test(form.phone.trim())) return setFeedback({ type: 'error', message: 'Số điện thoại không hợp lệ (vd: 0901234567)' })
    }
    setSaving(true); setFeedback(null)
    try {
      // POST /companies/{companyId}/employees — CreateEmployeeRequest
      // Fields: departmentId(@NotNull), fullName(@NotBlank), email(@Email @NotBlank), phone?, positionTitle?
      const dto = {
        departmentId: form.departmentId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        positionTitle: form.positionTitle?.trim() || null,
      }
      if (modal === 'create') {
        await employeeService.create(companyId, dto)
        setFeedback({ type: 'success', message: 'Đã thêm nhân viên!' })
      } else {
        // PUT /employees/{employeeId} — UpdateEmployeeRequest
        await employeeService.update(editTarget.id, dto)
        setFeedback({ type: 'success', message: 'Đã cập nhật nhân viên!' })
      }
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleDelete = async (emp) => {
    if (!window.confirm(`Xóa nhân viên "${emp.fullName}"?`)) return
    try {
      await employeeService.delete(emp.id)
      setFeedback({ type: 'success', message: 'Đã xóa nhân viên!' })
      await load()
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
  }

  const handleCreateAccount = async () => {
    if (!accountForm.email || !accountForm.password) return setFeedback({ type: 'error', message: 'Email và mật khẩu là bắt buộc' })
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(accountForm.email)) return setFeedback({ type: 'error', message: 'Email không đúng định dạng' })
    // Validate password length
    if (accountForm.password.length < 6) return setFeedback({ type: 'error', message: 'Mật khẩu phải ít nhất 6 ký tự' })
    setSaving(true); setFeedback(null)
    try {
      // POST /employees/{employeeId}/account  body: { email, password, role }
      await employeeService.createAccount(editTarget.id, {
        email: accountForm.email,
        password: accountForm.password,
        role: accountForm.role,
      })
      setFeedback({ type: 'success', message: 'Đã tạo tài khoản đăng nhập!' })
      setModal(null)
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-700 min-w-[200px]"
            >
              <option value="">Tất cả phòng ban ({employees.length})</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({employees.filter(e => e.departmentId === d.id).length})</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button
          id="ca-add-employee"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-all shadow-sm hover:shadow-md focus:ring-4 focus:ring-[#3C50E0]/30"
        >
          <UserPlus size={16} /> Thêm nhân viên
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 size={32} className="animate-spin text-[#3C50E0] mb-4" />
          <p className="text-sm font-medium">Đang tải danh sách nhân sự...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nhân viên</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Phòng ban</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Chức danh</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <Users size={32} className="mb-3 opacity-50" />
                        <p>Không tìm thấy nhân viên nào</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map(emp => {
                  const dept = deptMap[emp.departmentId]
                  const initials = (emp.fullName ?? '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                  return (
                    <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-inner"
                            style={{ background: `linear-gradient(135deg, ${dept?.color ?? '#3C50E0'} 0%, ${dept?.color ?? '#3C50E0'}dd 100%)` }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-[#3C50E0] transition-colors">{emp.fullName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                              <Mail size={12} />
                              <span>{emp.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        {dept ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full text-slate-700 bg-slate-100 border border-slate-200">
                            <span className="w-2 h-2 rounded-full" style={{ background: dept.color ?? '#3C50E0' }}></span>
                            {dept.name}
                          </span>
                        ) : <span className="text-slate-400 text-xs italic">Chưa phân bổ</span>}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-slate-600 font-medium">{emp.positionTitle ?? '—'}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={clsx(
                          'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border',
                          emp.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        )}>
                          {emp.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openAccount(emp)}
                            title="Tạo tài khoản đăng nhập"
                            className="p-2 text-slate-500 hover:text-[#3C50E0] bg-white border border-slate-200 hover:border-[#3C50E0]/30 hover:bg-blue-50 rounded-lg transition-all shadow-sm"
                          ><Shield size={14} /></button>
                          <button
                            onClick={() => openEdit(emp)}
                            title="Chỉnh sửa"
                            className="p-2 text-slate-500 hover:text-amber-600 bg-white border border-slate-200 hover:border-amber-600/30 hover:bg-amber-50 rounded-lg transition-all shadow-sm"
                          ><Pencil size={14} /></button>
                          <button
                            onClick={() => handleDelete(emp)}
                            title="Xóa"
                            className="p-2 text-slate-500 hover:text-red-600 bg-white border border-slate-200 hover:border-red-600/30 hover:bg-red-50 rounded-lg transition-all shadow-sm"
                          ><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Employee Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Thêm nhân viên mới' : 'Chỉnh sửa thông tin nhân viên'} onClose={() => setModal(null)}>
          <div className="space-y-5">
            <FormField label="Họ và tên" required>
              <Input id="emp-fullname" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="VD: Nguyễn Văn A" />
            </FormField>
            
            <FormField label="Email" required>
              <Input id="emp-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="VD: nhanvien@company.vn" />
            </FormField>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Phòng ban" required>
                <select
                  value={form.departmentId}
                  onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800"
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </FormField>
              
              <FormField label="Chức danh">
                <Input id="emp-title" value={form.positionTitle} onChange={e => setForm(f => ({ ...f, positionTitle: e.target.value }))} placeholder="VD: Nhân viên kinh doanh" />
              </FormField>
            </div>
            
            <FormField label="Số điện thoại">
              <Input id="emp-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="VD: 0901234567" />
            </FormField>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
              <button id="emp-save" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:bg-slate-300 transition-all shadow-md hover:shadow-lg">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Đang lưu...' : 'Lưu nhân viên'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Account Modal */}
      {modal === 'account' && editTarget && (
        <Modal title="Tạo tài khoản đăng nhập" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-800">
              <Shield size={20} className="shrink-0 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Cấp quyền truy cập hệ thống cho <span className="text-[#3C50E0]">{editTarget.fullName}</span></p>
                <p className="text-blue-600/80 leading-relaxed">Sau khi tạo, nhân viên có thể sử dụng email và mật khẩu này để đăng nhập vào hệ thống BSC.</p>
              </div>
            </div>
            
            <FormField label="Email đăng nhập" required>
              <Input id="acc-email" type="email" value={accountForm.email} onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))} placeholder="nhanvien@company.vn" />
            </FormField>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Mật khẩu ban đầu" required>
                <div className="relative">
                  <input
                    id="acc-password"
                    type={showPass ? 'text' : 'password'}
                    value={accountForm.password}
                    onChange={e => setAccountForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-2.5 pr-10 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
              
              <FormField label="Vai trò" required>
                <select
                  id="acc-role"
                  value={accountForm.role}
                  onChange={e => setAccountForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800"
                >
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </FormField>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
              <button id="acc-create" onClick={handleCreateAccount} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:bg-slate-300 transition-all shadow-md hover:shadow-lg">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />} {saving ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'company',     label: 'Thông tin Công ty', icon: Building2 },
  { id: 'departments', label: 'Phòng ban',          icon: LayoutGrid },
  { id: 'employees',   label: 'Nhân sự',            icon: Users },
]

export default function CompanyAdminPage() {
  const { user } = useAuthStore()
  const companyId = user?.companyId
  const [activeTab, setActiveTab] = useState('company')

  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Building2 size={64} className="mb-6 opacity-20" />
        <p className="text-lg font-medium text-slate-600">Không tìm thấy thông tin công ty</p>
        <p className="text-sm mt-2">Vui lòng liên hệ quản trị viên hệ thống để kiểm tra tài khoản của bạn.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mb-3 border border-blue-100">
            <Shield size={12} /> Workspace Admin
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản trị Công ty</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">Quản lý toàn diện hồ sơ doanh nghiệp, cơ cấu tổ chức và danh sách nhân sự tham gia hệ thống BSC.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Modern Pill Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar pb-2">
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 inline-flex min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  id={`ca-tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={clsx(
                    'flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all rounded-xl relative',
                    isActive
                      ? 'text-[#3C50E0] bg-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  )}
                >
                  <Icon size={16} className={clsx("transition-transform duration-300", isActive ? "scale-110 text-[#3C50E0]" : "opacity-70")} /> 
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content area */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
          {activeTab === 'company'     && <CompanyTab     companyId={companyId} />}
          {activeTab === 'departments' && <DepartmentsTab companyId={companyId} />}
          {activeTab === 'employees'   && <EmployeesTab   companyId={companyId} />}
        </div>
      </div>
    </div>
  )
}
