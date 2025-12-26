/**
 * Workflow Actions Provider
 * Registers context menu actions for the workflow
 */

import { useEffect, type ReactNode } from "react";
import { contextMenuActionsRegistry } from "@/core/registry";
import { useNodeActions } from "../hooks/useNodeActions";
import { useEdgeActions } from "../hooks/useEdgeActions";
import { useWorkflowStore } from "@/core/store/workflowStore";

interface WorkflowActionsProviderProps {
  children: ReactNode;
}

export function WorkflowActionsProvider({
  children,
}: WorkflowActionsProviderProps) {
  const nodeActions = useNodeActions();
  const edgeActions = useEdgeActions();
  const { selectNode, selectEdge } = useWorkflowStore();

  useEffect(() => {
    // Register all actions
    contextMenuActionsRegistry.registerActions({
      // Node actions
      changeNodeColor: nodeActions.changeNodeColor,
      changeNodeBorderStyle: nodeActions.changeNodeBorderStyle,
      deleteNode: nodeActions.removeNode,
      duplicateNode: nodeActions.duplicateNode,
      toggleNodeCollapse: nodeActions.toggleNodeCollapse,
      updateNodeData: nodeActions.updateNodeData,
      selectNode,

      // Edge actions
      changeEdgeColor: edgeActions.changeEdgeColor,
      changePathType: edgeActions.changePathType,
      changeEdgePathStyle: edgeActions.changeEdgePathStyle,
      changeEdgeAnimation: edgeActions.changeEdgeAnimation,
      addEdgeLabel: edgeActions.addEdgeLabel,
      deleteEdge: edgeActions.removeEdge,
      selectEdge,
    });

    return () => {
      // Clean up on unmount
      contextMenuActionsRegistry.clearActions();
    };
  }, [nodeActions, edgeActions, selectNode, selectEdge]);

  return <>{children}</>;
}
