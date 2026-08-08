import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';

type TaskItem = {
  id: string;
  project: string;
  taskName: string;
  description: string;
  assignee: string;
  deadline: string;
  status: TaskStatus;
};

const defaultForm: Omit<TaskItem, 'id'> = {
  project: 'SME Portal Expansion',
  taskName: '',
  description: '',
  assignee: '',
  deadline: '',
  status: 'Todo',
};

export function Tasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'TASK-201', project: 'SME Portal Expansion', taskName: 'Prepare SME pricing configuration', description: 'Set pricing matrix and promo conditions.', assignee: 'Nguyen Van A', deadline: '2026-03-17', status: 'Todo' },
    { id: 'TASK-202', project: 'Mobile Banking App', taskName: 'Implement queue monitoring', description: 'Add failure alerting and dashboards.', assignee: 'Le Hong Duc', deadline: '2026-03-16', status: 'In Progress' },
    { id: 'TASK-203', project: 'Mobile Banking App', taskName: 'Review API error handling', description: 'Verify retry policy and edge cases.', assignee: 'Pham Van C', deadline: '2026-03-15', status: 'Review' },
  ]);
  const [projectFilter, setProjectFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [form, setForm] = useState(defaultForm);

  const counts = useMemo(() => ({
    todo: tasks.filter((task) => task.status === 'Todo').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    review: tasks.filter((task) => task.status === 'Review').length,
    done: tasks.filter((task) => task.status === 'Done').length,
  }), [tasks]);

  const projects = useMemo(() => ['All', ...Array.from(new Set(tasks.map((task) => task.project)))], [tasks]);

  const filteredTasks = useMemo(() => {
    if (projectFilter === 'All') {
      return tasks;
    }
    return tasks.filter((task) => task.project === projectFilter);
  }, [projectFilter, tasks]);

  const save = () => {
    if (!form.taskName.trim()) return;
    if (editing) {
      setTasks((prev) => prev.map((task) => (task.id === editing.id ? { ...task, ...form } : task)));
    } else {
      setTasks((prev) => [...prev, { id: `TASK-${String(prev.length + 1 + 200).padStart(3, '0')}`, ...form }]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Create tasks inside projects, assign members, and update status: Todo, In Progress, Review, Done."
        action={<button onClick={() => { setEditing(null); setForm(defaultForm); setOpen(true); }} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Create task</button>}
      />

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <label className="text-sm text-gray-600 mr-3">Project filter</label>
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg">
          {projects.map((project) => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Todo" value={counts.todo} />
        <StatCard label="In Progress" value={counts.inProgress} />
        <StatCard label="Review" value={counts.review} />
        <StatCard label="Done" value={counts.done} />
      </div>

      <DataTable headers={['ID', 'Project', 'Task name', 'Assignee', 'Deadline', 'Status', 'Actions']}>
        {filteredTasks.map((task) => (
          <tr key={task.id}>
            <td className="px-4 py-3 text-gray-700">{task.id}</td>
            <td className="px-4 py-3 text-gray-700">{task.project}</td>
            <td className="px-4 py-3">
              <p className="font-medium text-gray-900">{task.taskName}</p>
              <p className="text-xs text-gray-500">{task.description}</p>
            </td>
            <td className="px-4 py-3 text-gray-700">{task.assignee}</td>
            <td className="px-4 py-3 text-gray-700">{task.deadline}</td>
            <td className="px-4 py-3">
              <StatusBadge
                label={task.status}
                tone={task.status === 'Done' ? 'success' : task.status === 'Review' ? 'warning' : task.status === 'In Progress' ? 'info' : 'neutral'}
              />
            </td>
            <td className="px-4 py-3 space-x-3">
              <button onClick={() => { setEditing(task); setForm({ project: task.project, taskName: task.taskName, description: task.description, assignee: task.assignee, deadline: task.deadline, status: task.status }); setOpen(true); }} className="text-cyan-700 hover:underline">Edit</button>
              <button onClick={() => setTasks((prev) => prev.filter((x) => x.id !== task.id))} className="text-rose-600 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </DataTable>

      <Modal open={open} title={editing ? 'Edit task' : 'Create task'} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg">
            {projects.filter((project) => project !== 'All').map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
          <input value={form.taskName} onChange={(e) => setForm({ ...form, taskName: e.target.value })} placeholder="Task name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Description" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Assignee" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg">
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={save} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
