import { useReactFlow, type Edge, type Node } from '@xyflow/react'
import { useCallback } from 'react'

interface UseUpdateConfigFlowReturn {
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void
}

export function useUpdateConfigFlow(): UseUpdateConfigFlowReturn {
  const { setNodes, setEdges } = useReactFlow()

  // Update entire node (any field)
  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    console.log("🚀 ~ nodeId:", nodeId)
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ...updates,
            data: updates.data
              ? {
                  ...node.data,
                  ...updates.data,
                }
              : node.data,
          }
        }
        return node
      })
    )
  }, [])

  // Update entire edge (any field)
  const updateEdge = useCallback((edgeId: string, updates: Partial<Edge>) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            ...updates,
            data: updates.data
              ? {
                  ...edge.data,
                  ...updates.data,
                }
              : edge.data,
          }
        }
        return edge
      })
    )
  }, [])

  return {
    updateNode,
    updateEdge,
  }
}
