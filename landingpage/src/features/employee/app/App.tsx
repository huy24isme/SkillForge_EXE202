import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/features/employee/app/components/Layout';
import { EmployeeLayout } from '@/features/employee/app/components/EmployeeLayout';
import { LandingPage } from '@/features/employee/app/screens/LandingPage';
import { Dashboard } from '@/features/employee/app/screens/Dashboard';
import { CreateProject } from '@/features/employee/app/screens/CreateProject';
import { ProjectOverview } from '@/features/employee/app/screens/ProjectOverview';
import { DailyReport } from '@/features/employee/app/screens/DailyReport';
import { UserProfile } from '@/features/employee/app/screens/UserProfile';
import { EmployeeTasks } from '@/features/employee/app/screens/employee/EmployeeTasks';
import { EmployeeDailyReport } from '@/features/employee/app/screens/employee/EmployeeDailyReport';
import { EmployeeProjects } from '@/features/employee/app/screens/employee/EmployeeProjects';

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route index element={<LandingPage />} />

      {/* Management/Admin Routes */}
      <Route path="admin/*" element={
        <Layout>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="create-project" element={<CreateProject />} />
            <Route path="projects" element={<ProjectOverview />} />
            <Route path="daily-report" element={<DailyReport />} />
            <Route path="profile" element={<UserProfile />} />
          </Routes>
        </Layout>
      } />

      {/* Employee Routes */}
      <Route path="employee/*" element={
        <EmployeeLayout>
          <Routes>
            <Route index element={<EmployeeTasks />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="daily-report" element={<EmployeeDailyReport />} />
            <Route path="projects" element={<EmployeeProjects />} />
            <Route path="projects/active" element={<EmployeeProjects />} />
            <Route path="projects/completed" element={<EmployeeProjects />} />
          </Routes>
        </EmployeeLayout>
      } />
    </Routes>
  );
}
