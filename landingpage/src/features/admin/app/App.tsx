import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/features/admin/app/components/AdminLayout';
import { Employees } from '@/features/admin/app/screens/Employees';
import { Departments } from '@/features/admin/app/screens/Departments';
import { Users } from '@/features/admin/app/screens/Users';
import { Customers } from '@/features/admin/app/screens/Customers';
import { CompanySettings } from '@/features/admin/app/screens/CompanySettings';

export default function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="employees" replace />} />
        <Route path="employees" element={<Employees />} />
        <Route path="departments" element={<Departments />} />
        <Route path="users" element={<Users />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<CompanySettings />} />
      </Routes>
    </AdminLayout>
  );
}
