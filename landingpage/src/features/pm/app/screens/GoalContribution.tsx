import { Target, TrendingUp } from 'lucide-react';

const goals = [
  {
    id: 'G-01',
    name: 'Increase SME revenue',
    perspective: 'Financial',
    owner: 'CEO',
    projects: [
      { name: 'SME Portal Expansion', contribution: 42 },
      { name: 'E-Commerce Platform v2.0', contribution: 23 },
    ],
  },
  {
    id: 'G-02',
    name: 'Reduce delayed projects',
    perspective: 'Internal Process',
    owner: 'COO',
    projects: [
      { name: 'Mobile Banking App', contribution: 35 },
      { name: 'QA Automation Upgrade', contribution: 28 },
    ],
  },
];

export function GoalContribution() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 inline-flex items-center gap-2">
          <Target className="w-5 h-5 text-[#3AE7E1]" />
          Goal Contribution
        </h2>
        <p className="text-sm text-gray-600 mt-2">Top-down mapping from leadership goals to project execution outcomes.</p>
      </div>

      {goals.map((goal) => (
        <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{goal.perspective} perspective</p>
              <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
            </div>
            <span className="text-sm text-gray-600">Goal owner: {goal.owner}</span>
          </div>

          <div className="space-y-3">
            {goal.projects.map((project) => (
              <div key={project.name} className="rounded-lg border border-gray-100 p-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">{project.name}</span>
                  <span className="inline-flex items-center gap-1 text-[#0B1C2D]">
                    <TrendingUp className="w-4 h-4" /> {project.contribution}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-[#3AE7E1]" style={{ width: `${project.contribution}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
