import { useEffect } from 'react'
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { Plus, Trash2 } from 'lucide-react'
import { useStrategyMap } from '../../hooks/useStrategyMap.js'
import { useStrategyStore } from '../../store/strategyStore.js'
import { ObjectiveNode } from './ObjectiveNode.jsx'
import { ObjectiveDetail } from './ObjectiveDetail.jsx'
import { PERSPECTIVES } from '../../constants/bsc.js'

const nodeTypes = { objectiveNode: ObjectiveNode }

const LANE_HEIGHT = 200
const LANE_Y = { financial: 660, customer: 440, internal: 220, learning: 0 }

const STRATEGY_COLORS = ['#2563eb', '#9333ea', '#16a34a', '#d97706', '#dc2626', '#0891b2']

export function StrategyMapCanvas() {
  const { nodes: initNodes, edges: initEdges } = useStrategyMap()
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes)
  const [edges, , onEdgesChange] = useEdgesState(initEdges)
  const {
    strategySets,
    activeStrategyId,
    setActiveStrategy,
    addStrategy,
    deleteStrategy,
    selectedObjectiveId,
    selectObjective,
    clearSelection,
    updateObjectivePosition,
  } = useStrategyStore()

  // Sync nodes/edges when active strategy changes
  useEffect(() => {
    setNodes(initNodes)
  }, [activeStrategyId, initNodes, setNodes])

  function onNodeClick(_, node) {
    selectObjective(node.id)
  }

  function onNodeDragStop(_, node) {
    updateObjectivePosition(node.id, node.position)
  }

  const activeStrategy = strategySets.find(s => s.id === activeStrategyId)

  return (
    <div className="w-full h-full relative bg-slate-50 flex flex-col">
      {/* Strategy tabs */}
      <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-slate-200 shrink-0 overflow-x-auto">
        {strategySets.map((s) => (
          <div key={s.id} className="flex items-center gap-0 shrink-0">
            <button
              onClick={() => setActiveStrategy(s.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-l-lg text-xs font-semibold transition-all"
              style={s.id === activeStrategyId
                ? { background: s.color, color: '#fff', boxShadow: `0 2px 8px ${s.color}40` }
                : { background: '#f1f5f9', color: '#64748b' }
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: s.id === activeStrategyId ? '#fff' : s.color }}
              />
              {s.name}
            </button>
            {strategySets.length > 1 && (
              <button
                onClick={() => deleteStrategy(s.id)}
                className="px-1.5 py-1.5 rounded-r-lg text-xs transition-all hover:bg-red-100 hover:text-red-600"
                style={s.id === activeStrategyId
                  ? { background: s.color, color: '#fff9' }
                  : { background: '#f1f5f9', color: '#cbd5e1' }
                }
                title="Xóa chiến lược"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addStrategy(`Chiến lược ${strategySets.length + 1}`, '', STRATEGY_COLORS[strategySets.length % STRATEGY_COLORS.length])}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0 ml-1"
          title="Thêm chiến lược"
        >
          <Plus size={13} /> Thêm
        </button>
        {activeStrategy?.description && (
          <span className="ml-3 text-xs text-slate-400 italic truncate hidden sm:block">
            {activeStrategy.description}
          </span>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        {/* Lane labels on left */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-8 flex flex-col justify-end pointer-events-none">
          {PERSPECTIVES.map(p => (
            <div
              key={p.id}
              className="flex items-center justify-center"
              style={{ height: LANE_HEIGHT, backgroundColor: `${p.color}15`, borderRight: `2px solid ${p.color}30` }}
            >
              <span className="text-xs font-bold" style={{ color: p.color, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: 1 }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onPaneClick={clearSelection}
          nodeTypes={nodeTypes}
          fitView
          className="ml-8"
          minZoom={0.3}
          maxZoom={1.5}
        >
          {PERSPECTIVES.map(p => (
            <div
              key={p.id}
              className="absolute w-full pointer-events-none"
              style={{
                top: LANE_Y[p.id],
                height: LANE_HEIGHT,
                backgroundColor: `${p.color}08`,
                borderBottom: `1px dashed ${p.color}30`,
              }}
            />
          ))}
          <Background color="#e2e8f0" gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeColor={node => node.data?.perspective?.color ?? '#94a3b8'}
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          />
        </ReactFlow>

        {selectedObjectiveId && (
          <ObjectiveDetail objectiveId={selectedObjectiveId} onClose={clearSelection} />
        )}
      </div>
    </div>
  )
}
