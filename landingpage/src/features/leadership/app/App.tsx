import { Routes, Route, Navigate } from 'react-router-dom';
// Use relative path instead of alias
import { LandingPage } from './screens/LandingPage';

// Executive Components - using relative paths
import { ExecutiveLayout } from './components/ExecutiveLayout';
import { ExecutiveDashboard } from './screens/executive/ExecutiveDashboard';
import { ExecutivePersonnel } from './screens/executive/ExecutivePersonnel';
import { DepartmentPersonnel } from './screens/executive/DepartmentPersonnel';
import { ExecutiveDailyReport } from './screens/executive/ExecutiveDailyReport';
import { ExecutiveWeeklyReport } from './screens/executive/ExecutiveWeeklyReport';
import { ExecutiveProjects } from './screens/executive/ExecutiveProjects';
import { ExecutiveAICreate } from './screens/executive/ExecutiveAICreate';
import { ExecutiveApprovals } from './screens/executive/ExecutiveApprovals';
import { ExecutiveProfile } from './screens/executive/ExecutiveProfile';
import FinancialPerspective from './screens/executive/bsc/FinancialPerspective';
import CustomerPerspective from './screens/executive/bsc/CustomerPerspective';
import InternalProcessPerspective from './screens/executive/bsc/InternalProcessPerspective';
import LearningGrowthPerspective from './screens/executive/bsc/LearningGrowthPerspective';
import BSCChatbot from './components/BSCChatbot';
import CeoReviewScheduler from './screens/executive/bsc/CeoReviewScheduler';
import ProcessOptimization from './screens/executive/bsc/ProcessOptimization';
import CostConfig from './screens/executive/CostConfig';

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route index element={<LandingPage />} />

      {/* Redirects for legacy/broken links */}
      <Route path="create-project" element={<Navigate to="executive/ai-create" replace />} />

      {/* Executive / Leadership Routes */}
      <Route path="executive/*" element={
        <ExecutiveLayout>
          <Routes>
            <Route index element={<ExecutiveDashboard />} />
            <Route path="financial" element={<FinancialPerspective />} />
            <Route path="customer" element={<CustomerPerspective />} />
            <Route path="process" element={<InternalProcessPerspective />} />
            <Route path="learning" element={<LearningGrowthPerspective />} />
            <Route path="chatbot" element={<BSCChatbot />} />
            <Route path="cost-config" element={<CostConfig />} />
            <Route path="ceo-review" element={<CeoReviewScheduler />} />
            <Route path="optimize" element={<ProcessOptimization />} />
            <Route path="personnel" element={<ExecutivePersonnel />} />
            <Route path="personnel/:deptId" element={<DepartmentPersonnel />} />
            <Route path="daily-report" element={<ExecutiveDailyReport />} />
            <Route path="weekly-report" element={<ExecutiveWeeklyReport />} />
            <Route path="projects" element={<ExecutiveProjects />} />
            <Route path="ai-create" element={<ExecutiveAICreate />} />
            <Route path="approvals" element={<ExecutiveApprovals />} />
            <Route path="profile" element={<ExecutiveProfile />} />
          </Routes>
        </ExecutiveLayout>
      } />

      {/* Catch-all redirect to Landing Page */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
