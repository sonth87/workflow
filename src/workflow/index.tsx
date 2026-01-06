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
import { Behavior } from "./components/Behavior";
import { initializePropertySystem } from "@/core/properties";
import { findTargetContainer, toRelativePosition } from "./utils/poolLaneRules";

function WorkflowBuilderInner() {
  const { createNode } = useNodeOperations();
  const { validate } = useWorkflowValidation();
  const {
    nodes,
    edges,
    setNodes,
    selectedNodeId,
    selectedEdgeId,
    saveToHistory,
    setLayoutDirection: storeSetLayoutDirection,
    layoutDirection,
  } = useWorkflowStore();
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const [isPanMode, setIsPanMode] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);

  const handleNodeDrop = useCallback(
    (nodeType: string, position: { x: number; y: number }) => {
      createNode(nodeType, position);

      // After creating node, check if it's inside a pool/lane and set parent
      setTimeout(() => {
        const { nodes: currentNodes } = useWorkflowStore.getState();
        const newNode = currentNodes[currentNodes.length - 1]; // Get the newly created node

        if (newNode && newNode.type !== "pool") {
          const targetContainer = findTargetContainer(
            newNode,
            currentNodes,
            false
          );

          if (targetContainer) {
            // For lane, only allow Pool as parent
            if (newNode.type === "lane" && targetContainer.type !== "pool") {
              return;
            }

            const { updateNode } = useWorkflowStore.getState();
            updateNode(newNode.id, {
              parentId: targetContainer.id,
              extent: targetContainer.data?.isLocked
                ? ("parent" as const)
                : undefined,
              position: toRelativePosition(
                newNode.position,
                targetContainer.position
              ),
              // Lane inside pool should not be draggable
              ...(newNode.type === "lane" && targetContainer.type === "pool"
                ? { draggable: false }
                : {}),
            });
          }
        }
      }, 0);
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
      // Save history before layout change
      saveToHistory();

      storeSetLayoutDirection(direction);

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
    [
      nodes,
      edges,
      setNodes,
      updateNodeInternals,
      fitView,
      saveToHistory,
      storeSetLayoutDirection,
    ]
  );

  const selectedNode = selectedNodeId
    ? nodes.find(n => n.id === selectedNodeId)
    : undefined;

  const selectedEdge = selectedEdgeId
    ? edges.find(e => e.id === selectedEdgeId)
    : undefined;

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="">
        <Header
          onSave={handleSave}
          layoutDirection={layoutDirection}
          onLayoutDirectionChange={handleChangeLayoutDirection}
        />
      </div>
      <div className="flex-1 bg-primaryA-100 overflow-hidden flex gap-2 px-2 pb-2">
        <div>
          <Toolbox />
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden">
          <Behavior onRun={handleRun} />
          <Canvas
            onNodeDrop={handleNodeDrop}
            isPanMode={isPanMode}
            onPanModeChange={setIsPanMode}
            showMinimap={showMinimap}
          />
        </div>

        {(selectedNode || selectedEdge) && (
          <div className="relative h-full">
            <PropertiesPanel />
          </div>
        )}

        <ValidationPanel onNodeSelect={handleNodeSelect} />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Toolbar
            isPanMode={isPanMode}
            onPanModeChange={setIsPanMode}
            showMinimap={showMinimap}
            onMinimapToggle={setShowMinimap}
          />
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
  // Initialize property system
  initializePropertySystem();

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
