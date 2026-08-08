import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Header } from './Header.jsx'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useAuthStore } from '../../store/authStore.js'
import { Toaster } from '../ui/toast.jsx'

const PAGE_TITLES = {
  '/dashboard':                   'Tổng quan SkillForge',
  '/assessment':                  'B1 · Đánh giá hiện trạng',
  '/strategy-build/swot':         'B2 · Phân tích SWOT',
  '/strategy-build/formulate':    'B2 · Xây dựng Chiến lược',
  '/strategy-results/selection':  'B3 · Lựa chọn Chiến lược',
  '/strategy-results/outcomes':   'B3 · Kết quả Chiến lược',
  '/strategy-map/perspectives':   'B4 · Thành phần BSC',
  '/strategy-map/company':        'B4 · Bản đồ Chiến lược',
  '/fishbone':                    'B5 · Mô hình Xương cá',
  '/kpi-setup':                   'B7 · Đo lường & Chỉ tiêu KPI',
  '/weight-allocation':           'B6 · Phân bổ Tỉ trọng',
  '/action-plan':                 'B8 · Action Plan',
  '/kpi-entry':                   'Nhập liệu KPI',
  '/reports':                     'Báo cáo & Phân tích',
}

function getTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  const match = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))
  return match ? match[1] : 'SkillForge'
}

export function AppShell() {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  // Roles that need BSC context (CEO, DEPARTMENT_HEAD)
  const needsBscContext = user && ['CEO', 'DEPARTMENT_HEAD'].includes(user.role)

  useEffect(() => {
    if (!needsBscContext) return
    useBscContextStore.getState().init().then(() => {
      const { strategyId } = useBscContextStore.getState()
      if (strategyId) useBSCWorkflowStore.getState().fetchSteps(strategyId)
    })
  }, [needsBscContext])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9]">
      <Toaster />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={getTitle(pathname)} />
        <main key={pathname} className="flex-1 overflow-y-auto p-6 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

