import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useKPIStore } from '../../store/kpiStore.js'
import { mockDepartments } from '../../data/mockDepartments.js'
import { mockUsers } from '../../data/mockUsers.js'
import { PERSPECTIVES } from '../../constants/bsc.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select, Textarea } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'

const LEVEL_LABELS = { company: 'Cấp Công ty', department: 'Cấp Phòng ban', individual: 'Cấp Cá nhân' }

export function KPIForm({ open, onClose, editingKPI, parentKPI }) {
  const { addKPI, updateKPI } = useKPIStore()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

  const isEdit = !!editingKPI
  const level = parentKPI ? (parentKPI.level === 'company' ? 'department' : 'individual') : 'company'

  useEffect(() => {
    if (open) {
      if (editingKPI) {
        reset({ ...editingKPI, targetValue: editingKPI.targetValues?.['T01-2024'] ?? '' })
      } else {
        reset({ level, perspectiveId: parentKPI?.perspectiveId ?? 'financial', periodType: 'monthly', weight: 100 })
      }
    }
  }, [open, editingKPI, parentKPI, reset])

  function onSubmit(data) {
    const target = parseFloat(data.targetValue)
    const targetValues = {}
    for (let m = 1; m <= 12; m++) {
      targetValues[`T${String(m).padStart(2, '0')}-2024`] = target
    }
    targetValues['Q1-2024'] = target * 3; targetValues['Q2-2024'] = target * 3
    targetValues['Q3-2024'] = target * 3; targetValues['Q4-2024'] = target * 3
    targetValues['NAM-2024'] = target * 12

    const payload = {
      ...data,
      weight: parseInt(data.weight),
      parentId: parentKPI?.id ?? null,
      children: editingKPI?.children ?? [],
      targetValues: { ...(editingKPI?.targetValues ?? {}), ...targetValues },
    }

    if (isEdit) {
      updateKPI(editingKPI.id, payload)
    } else {
      addKPI({ id: `kpi-new-${Date.now()}`, ...payload })
    }
    onClose()
  }

  const title = isEdit ? `Chỉnh sửa KPI: ${editingKPI?.name}` : parentKPI ? `Thêm KPI con cho: ${parentKPI.name}` : 'Thêm KPI Công ty'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="lg"
      footer={<>
        <Button variant="secondary" onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(onSubmit)}>{isEdit ? 'Lưu thay đổi' : 'Thêm KPI'}</Button>
      </>}
    >
      <div className="space-y-4">
        {parentKPI && (
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            KPI cha: <strong>{parentKPI.name}</strong> — Cấp: {LEVEL_LABELS[parentKPI.level]}
          </div>
        )}

        <Input label="Tên KPI *" {...register('name', { required: 'Vui lòng nhập tên KPI' })} error={errors.name?.message} placeholder="VD: Doanh thu thuần" />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Đơn vị *" {...register('unit', { required: true })} placeholder="VD: Tỷ đồng, %, khách" />
          <Input label="Giá trị mục tiêu (mỗi tháng) *" type="number" step="0.01" {...register('targetValue', { required: true, valueAsNumber: true })} placeholder="0" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Góc nhìn BSC" {...register('perspectiveId')}>
            {PERSPECTIVES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </Select>
          <Select label="Kỳ đánh giá" {...register('periodType')}>
            <option value="monthly">Hàng tháng</option>
            <option value="quarterly">Hàng quý</option>
            <option value="yearly">Hàng năm</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Phòng ban" {...register('deptId')}>
            {mockDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Người chịu trách nhiệm" {...register('ownerId')}>
            {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Trọng số (%)" type="number" min={0} max={100} {...register('weight', { valueAsNumber: true })} />
          <Select label="Cấp KPI" {...register('level')} disabled={!!parentKPI}>
            <option value="company">Cấp Công ty</option>
            <option value="department">Cấp Phòng ban</option>
            <option value="individual">Cấp Cá nhân</option>
          </Select>
        </div>
      </div>
    </Modal>
  )
}
