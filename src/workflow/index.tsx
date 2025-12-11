/**
 * Main Workflow Builder Component
 * Layout giống với workflow cũ
 */

import { useCallback, useState } from "react";
import {
  WorkflowProvider,
  type PluginOptions,
} from "./context/WorkflowProvider";
import { WorkflowActionsProvider } from "./context/WorkflowActionsProvider";
import { Canvas } from "./components/Canvas";
import { Toolbox } from "./components/Toolbox";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { Header, type LayoutDirection } from "./components/Header";
import { ValidationPanel } from "./components/ValidationPanel";
import { Toolbar } from "./components/Toolbar";
import { useNodeOperations, useWorkflowValidation } from "./hooks/useWorkflow";
import { useWorkflowStore } from "@/core/store/workflowStore";
import {
  ReactFlowProvider,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { getLayoutedElements } from "./utils/layout";

function WorkflowBuilderInner() {
  const { createNode } = useNodeOperations();
  const { validate } = useWorkflowValidation();
  const { nodes, edges, setNodes, selectedNodeIds, selectedEdgeIds } =
    useWorkflowStore();
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const [layoutDirection, setLayoutDirection] =
    useState<LayoutDirection>("horizontal");

  const handleNodeDrop = useCallback(
    (nodeType: string, position: { x: number; y: number }) => {
      createNode(nodeType, position);
    },
    [createNode]
  );

  const handleRun = useCallback(async () => {
    const result = await validate();

    if (!result.valid) {
      alert(
        `Cannot run workflow. Please fix ${result.errors.length} error(s).`
      );
      return;
    }

    console.log("Running workflow...", { nodes, edges });
    alert("Workflow execution started! Check console for details.");
  }, [validate, nodes, edges]);

  const handleSave = useCallback(async () => {
    await validate();

    const workflowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };

    console.log("Saving workflow...", workflowData);
    alert("Workflow saved! Check console for details.");
  }, [validate, nodes, edges]);

  const handleMenu = useCallback(() => {
    console.log("Menu clicked");
  }, []);

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        fitView({ nodes: [node], duration: 300, padding: 0.3 });
      }
    },
    [nodes, fitView]
  );

  const handleChangeLayoutDirection = useCallback(
    (direction: LayoutDirection) => {
      setLayoutDirection(direction);

      const { nodes: layoutedNodes } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes(layoutedNodes as any);

      setTimeout(() => {
        layoutedNodes.forEach(n => updateNodeInternals(n.id));
        fitView({ padding: 0.2, duration: 300, maxZoom: 1 });
      }, 100);
    },
    [nodes, edges, setNodes, updateNodeInternals, fitView]
  );

  const selectedNode =
    selectedNodeIds.length > 0
      ? nodes.find(n => n.id === selectedNodeIds[0])
      : undefined;

  const selectedEdge =
    selectedEdgeIds.length > 0
      ? edges.find(e => e.id === selectedEdgeIds[0])
      : undefined;

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="">
        <Header
          onRun={handleRun}
          onSave={handleSave}
          layoutDirection={layoutDirection}
          onLayoutDirectionChange={handleChangeLayoutDirection}
        />
      </div>
      <div className="relative h-screen w-screen bg-background overflow-hidden">
        <div className="absolute top-4 left-4 bottom-20 z-10 h-[calc(100%-2rem)]">
          <Toolbox />
        </div>

        <Canvas onNodeDrop={handleNodeDrop} />

        {selectedNode && (
          <div className="absolute top-4 right-4 bottom-20 z-10 h-[calc(100%-2rem)]">
            <PropertiesPanel />
          </div>
        )}

        {selectedEdge && (
          <div className="absolute top-4 right-4 bottom-20 z-10 h-[calc(100%-2rem)]">
            <PropertiesPanel />
          </div>
        )}

        <ValidationPanel onNodeSelect={handleNodeSelect} />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Toolbar onMenu={handleMenu} />
        </div>
      </div>
    </div>
  );
}

/**
 * Workflow Builder Props
 */
export interface WorkflowBuilderProps {
  /**
   * Plugin configuration options
   * Configure which plugins to use and how to initialize them
   */
  pluginOptions?: PluginOptions;
}

export default function WorkflowBuilder({
  pluginOptions,
}: WorkflowBuilderProps = {}) {
  return (
    <WorkflowProvider pluginOptions={pluginOptions}>
      <ReactFlowProvider>
        <WorkflowActionsProvider>
          <WorkflowBuilderInner />
        </WorkflowActionsProvider>
      </ReactFlowProvider>
    </WorkflowProvider>
  );
}
