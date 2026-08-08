import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore.js'
import { AppShell } from './components/layout/AppShell.jsx'
import LoginPage from './pages/Login/index.jsx'
import DashboardPage from './pages/Dashboard/index.jsx'
import StrategyMapPage from './pages/StrategyMap/index.jsx'
import KPISetupPage from './pages/KPISetup/index.jsx'
import KPIEntryPage from './pages/KPIEntry/index.jsx'
import ReportsPage from './pages/Reports/index.jsx'
import AssessmentPage from './pages/Assessment/index.jsx'
import SwotPage from './pages/StrategyBuild/SwotPage.jsx'
import FormulationPage from './pages/StrategyBuild/FormulationPage.jsx'
import SelectionPage from './pages/StrategyResults/SelectionPage.jsx'
import OutcomesPage from './pages/StrategyResults/OutcomesPage.jsx'
import PerspectivesPage from './pages/StrategyMap/PerspectivesPage.jsx'
import FishbonePage from './pages/Fishbone/index.jsx'
import WeightAllocationPage from './pages/WeightAllocation/index.jsx'
import ActionPlanPage from './pages/ActionPlan/index.jsx'
import SettingsPage from './pages/Settings/index.jsx'
import CompanyAdminPage from './pages/CompanyAdmin/index.jsx'
import EmployeeKanbanPage from './pages/Employee/KanbanPage.jsx'
import DepartmentHeadPage from './pages/DepartmentHead/index.jsx'

// ── Auth guard: requires login ────────────────────────────────────────────────
function RequireAuth() {
  const { user, token } = useAuthStore()
  if (!user || !token) return <Navigate to="/login" replace />
  return <Outlet />
}

// ── Role guard: requires specific role(s) ─────────────────────────────────────
function RequireRole({ roles }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-sm font-semibold">Không có quyền truy cập</p>
        <p className="text-xs">Trang này chỉ dành cho: {roles.join(', ')}</p>
      </div>
    )
  }
  return <Outlet />
}

// ── Role-based index redirect ─────────────────────────────────────────────────
function RoleRedirect() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  switch (user.role) {
    case 'COMPANY_ADMIN':  return <Navigate to="/company-admin" replace />
    case 'EMPLOYEE':       return <Navigate to="/kanban" replace />
    case 'DEPARTMENT_HEAD': return <Navigate to="/department-head" replace />
    default:               return <Navigate to="/dashboard" replace />
  }
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          // Root → role-based redirect
          { index: true, element: <RoleRedirect /> },

          // ── COMPANY_ADMIN routes ────────────────────────────────────────
          {
            element: <RequireRole roles={['COMPANY_ADMIN']} />,
            children: [
              { path: 'company-admin', element: <CompanyAdminPage /> },
            ],
          },

          // ── EMPLOYEE routes ─────────────────────────────────────────────
          {
            element: <RequireRole roles={['EMPLOYEE', 'CEO', 'DEPARTMENT_HEAD']} />,
            children: [
              { path: 'kanban', element: <EmployeeKanbanPage /> },
            ],
          },

          // ── DEPARTMENT_HEAD routes ─────────────────────────────────────
          {
            element: <RequireRole roles={['DEPARTMENT_HEAD']} />,
            children: [
              { path: 'department-head', element: <DepartmentHeadPage /> },
            ],
          },

          // ── CEO + DEPARTMENT_HEAD shared routes ────────────────────────
          {
            element: <RequireRole roles={['CEO', 'DEPARTMENT_HEAD']} />,
            children: [
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'reports',   element: <ReportsPage /> },
            ],
          },

          // ── CEO only (BSC Setup B1-B4, B6-B7) ─────────────────────────
          {
            element: <RequireRole roles={['CEO']} />,
            children: [
              { path: 'assessment',                  element: <AssessmentPage /> },
              { path: 'strategy-build',              element: <Navigate to="/strategy-build/swot" replace /> },
              { path: 'strategy-build/swot',         element: <SwotPage /> },
              { path: 'strategy-build/formulate',    element: <FormulationPage /> },
              { path: 'strategy-results',            element: <Navigate to="/strategy-results/selection" replace /> },
              { path: 'strategy-results/selection',  element: <SelectionPage /> },
              { path: 'strategy-results/outcomes',   element: <OutcomesPage /> },
              { path: 'strategy-map',                element: <Navigate to="/strategy-map/perspectives" replace /> },
              { path: 'strategy-map/perspectives',   element: <PerspectivesPage /> },
              { path: 'strategy-map/company',        element: <StrategyMapPage /> },
              { path: 'weight-allocation',           element: <WeightAllocationPage /> },
              { path: 'kpi-setup',                   element: <KPISetupPage /> },
              { path: 'kpi-entry',                   element: <KPIEntryPage /> },
            ],
          },

          // ── B5 Fishbone — DEPARTMENT_HEAD only ─────────────────────────
          {
            element: <RequireRole roles={['DEPARTMENT_HEAD', 'CEO']} />,
            children: [
              { path: 'fishbone', element: <FishbonePage /> },
            ],
          },

          // ── B8 Action Plan — DEPARTMENT_HEAD & CEO ──────────────────────
          {
            element: <RequireRole roles={['DEPARTMENT_HEAD', 'CEO']} />,
            children: [
              { path: 'action-plan', element: <ActionPlanPage /> },
            ],
          },

          // ── Settings — all authenticated roles ─────────────────────────
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
