import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

type Member = {
  id: string;
  name: string;
  role: string;
  workload: number;
  project: string;
};

const projects = ['SME Portal Expansion', 'Mobile Banking App', 'E-Commerce Platform v2.0'];

export function Team() {
  const [members, setMembers] = useState<Member[]>([
    { id: 'MEM-01', name: 'Nguyen Van A', role: 'Frontend Lead', workload: 78, project: 'SME Portal Expansion' },
    { id: 'MEM-02', name: 'Le Hong Duc', role: 'Backend Developer', workload: 92, project: 'Mobile Banking App' },
    { id: 'MEM-03', name: 'Tran Thi B', role: 'QA Engineer', workload: 63, project: 'SME Portal Expansion' },
  ]);

  const [openAssign, setOpenAssign] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const assign = () => {
    setMembers((prev) => prev.map((member) => (member.id === selectedMemberId ? { ...member, project: selectedProject } : member)));
    setOpenAssign(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="View team members, workload distribution, and assign members to projects."
        action={<button onClick={() => { setSelectedMemberId(members[0]?.id ?? ''); setSelectedProject(projects[0]); setOpenAssign(true); }} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Assign member to project</button>}
      />

      <DataTable headers={['Member', 'Role', 'Current Project', 'Workload', 'Status']}>
        {members.map((member) => (
          <tr key={member.id}>
            <td className="px-4 py-3">
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.id}</p>
            </td>
            <td className="px-4 py-3 text-gray-700">{member.role}</td>
            <td className="px-4 py-3 text-gray-700">{member.project}</td>
            <td className="px-4 py-3 text-gray-700">{member.workload}%</td>
            <td className="px-4 py-3">
              <StatusBadge label={member.workload > 85 ? 'High load' : member.workload > 70 ? 'Balanced' : 'Available'} tone={member.workload > 85 ? 'danger' : member.workload > 70 ? 'warning' : 'success'} />
            </td>
          </tr>
        ))}
      </DataTable>

      <Modal open={openAssign} title="Assign member to project" onClose={() => setOpenAssign(false)}>
        <div className="space-y-4">
          <select value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg">
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg">
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpenAssign(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={assign} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Assign</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
