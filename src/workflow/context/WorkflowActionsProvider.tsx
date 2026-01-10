/**
 * Workflow Actions Provider
 * Registers context menu actions for the workflow
 */

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { Dialog } from "@sth87/shadcn-design-system";
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
  const { selectNode, selectEdge, nodes, deleteNode } = useWorkflowStore();
  const [deletePoolDialogOpen, setDeletePoolDialogOpen] = useState(false);
  const [poolToDelete, setPoolToDelete] = useState<string | null>(null);

  // Get child nodes count for the pool
  const childNodesCount = poolToDelete
    ? nodes.filter(n => n.parentId === poolToDelete).length
    : 0;

  // Delete pool with confirmation
  const deletePoolWithConfirmation = useCallback(
    (poolId: string) => {
      const pool = nodes.find(n => n.id === poolId);
      if (!pool || pool.type !== "pool") {
        // Not a pool, delete normally
        nodeActions.removeNode(poolId);
        return;
      }

      const childNodes = nodes.filter(n => n.parentId === poolId);

      // If pool has child nodes, show confirmation dialog
      if (childNodes.length > 0) {
        setPoolToDelete(poolId);
        setDeletePoolDialogOpen(true);
      } else {
        // No child nodes, delete directly
        deleteNode(poolId);
      }
    },
    [nodes, nodeActions, deleteNode]
  );

  const handleConfirmDelete = useCallback(() => {
    if (poolToDelete) {
      deleteNode(poolToDelete);
      setPoolToDelete(null);
      setDeletePoolDialogOpen(false);
    }
  }, [poolToDelete, deleteNode]);

  const handleCancelDelete = useCallback(() => {
    setPoolToDelete(null);
    setDeletePoolDialogOpen(false);
  }, []);

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

      // Pool-specific action
      deletePoolWithConfirmation,

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
  }, [
    nodeActions,
    edgeActions,
    selectNode,
    selectEdge,
    deletePoolWithConfirmation,
  ]);

  return (
    <>
      {children}
      <Dialog
        open={deletePoolDialogOpen}
        onOpenChange={setDeletePoolDialogOpen}
        cancelButton={{
          onClick: handleCancelDelete,
          text: "Cancel",
          variant: "outline",
        }}
        confirmButton={{
          color: "primary",
          onClick: handleConfirmDelete,
          text: "Delete",
          variant: "solid",
        }}
        description={
          childNodesCount > 0
            ? `This pool contains ${childNodesCount} node${childNodesCount > 1 ? "s" : ""}. Deleting the pool will also delete all nodes inside it. Are you sure you want to proceed?`
            : "Are you sure you want to delete this pool?"
        }
        title="Delete Pool"
        variant="warning"
      />
    </>
  );
}
