import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/features/pm/app/components/Layout';
import { ManagerDashboard } from '@/features/pm/app/screens/ManagerDashboard';
import { GoalContribution } from '@/features/pm/app/screens/GoalContribution';
import { Customers } from '@/features/pm/app/screens/Customers';
import { Projects } from '@/features/pm/app/screens/Projects';
import { Tasks } from '@/features/pm/app/screens/Tasks';
import { Team } from '@/features/pm/app/screens/Team';
import { Reports } from '@/features/pm/app/screens/Reports';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route index element={<ManagerDashboard />} />
        <Route path="goal-contribution" element={<GoalContribution />} />
        <Route path="customers" element={<Customers />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="team" element={<Team />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </Layout>
  );
}
