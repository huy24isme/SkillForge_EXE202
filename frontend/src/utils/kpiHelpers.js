import { mockKPIs } from '../data/mockKPIs.js'

export function buildKPITree(kpis = mockKPIs) {
  const map = Object.fromEntries(kpis.map(k => [k.id, { ...k, _children: [] }]))
  const roots = []
  kpis.forEach(k => {
    if (k.parentId && map[k.parentId]) {
      map[k.parentId]._children.push(map[k.id])
    } else if (!k.parentId) {
      roots.push(map[k.id])
    }
  })
  return roots
}

export function flattenKPITree(nodes, depth = 0) {
  const result = []
  nodes.forEach(node => {
    result.push({ ...node, _depth: depth })
    if (node._children?.length) {
      result.push(...flattenKPITree(node._children, depth + 1))
    }
  })
  return result
}

export function getKPIsByDept(deptId, kpis = mockKPIs) {
  return kpis.filter(k => k.deptId === deptId)
}

export function getKPIsByPerspective(perspectiveId, kpis = mockKPIs) {
  return kpis.filter(k => k.perspectiveId === perspectiveId)
}
