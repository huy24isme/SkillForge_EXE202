import { useMemo } from 'react'
import { useStrategyStore } from '../store/strategyStore.js'
import { PERSPECTIVE_MAP } from '../constants/bsc.js'

const LANE_Y = {
  financial: 660,
  customer:  440,
  internal:  220,
  learning:  0,
}
const LANE_HEIGHT = 200

export function useStrategyMap() {
  const { strategySets, activeStrategyId } = useStrategyStore()

  const activeStrategy = strategySets.find(s => s.id === activeStrategyId) ?? strategySets[0]
  const objectives = activeStrategy?.objectives ?? []
  const links = activeStrategy?.links ?? []

  const nodes = useMemo(() => objectives.map(obj => ({
    id: obj.id,
    type: 'objectiveNode',
    position: obj.position ?? { x: 100, y: LANE_Y[obj.perspective] + 80 },
    data: { ...obj, perspective: PERSPECTIVE_MAP[obj.perspective] },
  })), [objectives])

  const edges = useMemo(() => links.map(link => ({
    id: link.id,
    source: link.sourceId,
    target: link.targetId,
    label: link.label,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#94a3b8', strokeWidth: 1.5 },
    labelStyle: { fontSize: 11, fill: '#64748b' },
    labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 },
  })), [links])

  const lanes = useMemo(() => Object.entries(LANE_Y).map(([id, y]) => ({
    id, y, height: LANE_HEIGHT, perspective: PERSPECTIVE_MAP[id],
  })), [])

  return { nodes, edges, lanes, activeStrategy }
}
