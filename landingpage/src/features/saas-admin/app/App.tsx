import { Routes, Route, Navigate } from 'react-router-dom';
import { SaasAdminLayout } from '@/features/saas-admin/app/components/SaasAdminLayout';
import { DashboardScreen } from '@/features/saas-admin/app/screens/DashboardScreen';
import { UsersScreen } from '@/features/saas-admin/app/screens/UsersScreen';
import { SubscriptionsScreen } from '@/features/saas-admin/app/screens/SubscriptionsScreen';
import { RevenueScreen } from '@/features/saas-admin/app/screens/RevenueScreen';
import { PaymentsScreen } from '@/features/saas-admin/app/screens/PaymentsScreen';
import { AnalyticsScreen } from '@/features/saas-admin/app/screens/AnalyticsScreen';
import { ReportsScreen } from '@/features/saas-admin/app/screens/ReportsScreen';
import { SystemLogsScreen } from '@/features/saas-admin/app/screens/SystemLogsScreen';
import { SettingsScreen } from '@/features/saas-admin/app/screens/SettingsScreen';

export default function SaasAdminApp() {
  return (
    <SaasAdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardScreen />} />
        <Route path="users" element={<UsersScreen />} />
        <Route path="subscriptions" element={<SubscriptionsScreen />} />
        <Route path="revenue" element={<RevenueScreen />} />
        <Route path="payments" element={<PaymentsScreen />} />
        <Route path="analytics" element={<AnalyticsScreen />} />
        <Route path="reports" element={<ReportsScreen />} />
        <Route path="system-logs" element={<SystemLogsScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
      </Routes>
    </SaasAdminLayout>
  );
}
