/**
 * Workflow Actions Provider
 * Registers context menu actions for the workflow
 */

import { useEffect, type ReactNode } from "react";
import { contextMenuActionsRegistry } from "@/core/registry";
import { useNodeActions } from "../hooks/useNodeActions";
import { useEdgeActions } from "../hooks/useEdgeActions";

interface WorkflowActionsProviderProps {
  children: ReactNode;
}

export function WorkflowActionsProvider({
  children,
}: WorkflowActionsProviderProps) {
  const nodeActions = useNodeActions();
  const edgeActions = useEdgeActions();

  useEffect(() => {
    // Register all actions
    contextMenuActionsRegistry.registerActions({
      // Node actions
      changeNodeColor: nodeActions.changeNodeColor,
      changeNodeBorderStyle: nodeActions.changeNodeBorderStyle,
      deleteNode: nodeActions.removeNode,
      duplicateNode: nodeActions.duplicateNode,
      toggleNodeCollapse: nodeActions.toggleNodeCollapse,

      // Edge actions
      changeEdgeColor: edgeActions.changeEdgeColor,
      changeEdgeType: edgeActions.changeEdgeType,
      changeEdgePathStyle: edgeActions.changeEdgePathStyle,
      deleteEdge: edgeActions.removeEdge,
    });

    return () => {
      // Clean up on unmount
      contextMenuActionsRegistry.clearActions();
    };
  }, [nodeActions, edgeActions]);

  return <>{children}</>;
}
