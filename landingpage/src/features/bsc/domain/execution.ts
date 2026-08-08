export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface EmployeeTask {
  id: string;
  title: string;
  projectName: string;
  assignee: string;
  deadline: string;
  estimatedHours: number;
  status: TaskStatus;
}

export interface DailyReportEntry {
  employee: string;
  blockers: string;
  submittedAt: string;
}

export interface TeamMemberWorkload {
  employee: string;
  assignedTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  workloadScore: number;
}

export interface ExecutionInsights {
  projectProgress: number;
  deliveryEfficiency: number;
  blockedReportsCount: number;
  teamWorkloads: TeamMemberWorkload[];
}

const STATUS_WEIGHT: Record<TaskStatus, number> = {
  Todo: 0,
  'In Progress': 0.5,
  Review: 0.8,
  Done: 1,
};

export function calculateProjectProgress(tasks: EmployeeTask[]): number {
  if (tasks.length === 0) return 0;
  const weightedSum = tasks.reduce((sum, task) => sum + STATUS_WEIGHT[task.status], 0);
  return Math.round((weightedSum / tasks.length) * 100);
}

export function calculateDeliveryEfficiency(tasks: EmployeeTask[]): number {
  if (tasks.length === 0) return 0;
  const doneCount = tasks.filter((task) => task.status === 'Done').length;
  return Math.round((doneCount / tasks.length) * 100);
}

export function buildTeamWorkloads(tasks: EmployeeTask[]): TeamMemberWorkload[] {
  const memberMap = new Map<string, TeamMemberWorkload>();

  tasks.forEach((task) => {
    const existing = memberMap.get(task.assignee) ?? {
      employee: task.assignee,
      assignedTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0,
      workloadScore: 0,
    };

    existing.assignedTasks += 1;
    if (task.status === 'In Progress' || task.status === 'Review') {
      existing.inProgressTasks += 1;
    }
    if (task.status === 'Done') {
      existing.doneTasks += 1;
    }

    existing.workloadScore = Math.round(
      existing.inProgressTasks * 1.2 + (existing.assignedTasks - existing.doneTasks) * 0.8
    );

    memberMap.set(task.assignee, existing);
  });

  return Array.from(memberMap.values()).sort((a, b) => b.workloadScore - a.workloadScore);
}

export function buildExecutionInsights(
  tasks: EmployeeTask[],
  dailyReports: DailyReportEntry[]
): ExecutionInsights {
  const blockedReportsCount = dailyReports.filter((report) => report.blockers.trim().length > 0).length;

  return {
    projectProgress: calculateProjectProgress(tasks),
    deliveryEfficiency: calculateDeliveryEfficiency(tasks),
    blockedReportsCount,
    teamWorkloads: buildTeamWorkloads(tasks),
  };
}
