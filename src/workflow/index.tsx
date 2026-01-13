import { useCallback, useState } from "react";
import { Canvas } from "./components/Canvas";
import { Toolbox } from "./components/Toolbox";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { Header } from "./components/Header";
import { ValidationPanel } from "./components/ValidationPanel";
import { Toolbar } from "./components/Toolbar";
import { useNodeOperations, useWorkflowValidation } from "./hooks/useWorkflow";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { UndoRedo } from "./components/Behavior";
import {
  findTargetContainer,
  toRelativePosition,
  sortNodesByParentChild,
} from "./utils/poolLaneRules";
import { WorkflowCore, type WorkflowCoreProps } from "./WorkflowCore";

// Re-export PluginOptions from WorkflowCore
export type { PluginOptions } from "./context/WorkflowProvider";

// UI Configuration for SDK
export interface WorkflowUIConfig {
  // Header controls
  showHeader?: boolean;
  showImportExport?: boolean;
  showThemeToggle?: boolean;
  showLayoutControls?: boolean;
  showWorkflowName?: boolean;

  // Sidebar panels
  showToolbox?: boolean;
  showPropertiesPanel?: boolean;
  showValidationPanel?: boolean;

  // Toolbar controls
  showToolbar?: boolean;
  showPanMode?: boolean;
  showZoomControls?: boolean;
  showMinimap?: boolean;

  // Behavior
  showBehavior?: boolean;
  showRunButton?: boolean;

  // Mode
  mode?: "edit" | "view";
}

function WorkflowBuilderInner({ uiConfig }: { uiConfig?: WorkflowUIConfig }) {
  const { createNode } = useNodeOperations();
  const { validate } = useWorkflowValidation();
  const { nodes, edges, selectedNodeId, selectedEdgeId } = useWorkflowStore();
  const { fitView } = useReactFlow();

  const [isPanMode, setIsPanMode] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);

  const handleNodeDrop = useCallback(
    (nodeType: string, position: { x: number; y: number }) => {
      const newNode = createNode(nodeType, position);

      // After creating node, check if it's inside a pool/lane and set parent
      if (newNode && newNode.type !== "pool") {
        const { nodes: currentNodes } = useWorkflowStore.getState();
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

          // Sort nodes to ensure parent appears before child
          const updatedNodes = useWorkflowStore.getState().nodes;
          const sortedNodes = sortNodesByParentChild(updatedNodes);
          useWorkflowStore.getState().setNodes(sortedNodes);
        }
      }
    },
    [createNode]
  );

  const handleSave = useCallback(async () => {
    await validate();

    // Save workflow logic here
    alert("Workflow saved!");
  }, [validate]);

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        fitView({ nodes: [node], duration: 300, padding: 0.3 });
      }
    },
    [nodes, fitView]
  );

  const selectedNode = selectedNodeId
    ? nodes.find(n => n.id === selectedNodeId)
    : undefined;

  const selectedEdge = selectedEdgeId
    ? edges.find(e => e.id === selectedEdgeId)
    : undefined;

  // Merge default UI config with provided config
  const ui: Required<WorkflowUIConfig> = {
    showHeader: true,
    showImportExport: true,
    showThemeToggle: true,
    showLayoutControls: true,
    showWorkflowName: true,
    showToolbox: true,
    showPropertiesPanel: true,
    showValidationPanel: true,
    showToolbar: true,
    showPanMode: true,
    showZoomControls: true,
    showMinimap: true,
    showBehavior: true,
    showRunButton: true,
    mode: "edit",
    ...uiConfig,
  };

  const isViewMode = ui.mode === "view";

  return (
    <div className="flex flex-col h-screen w-screen">
      {ui.showHeader && (
        <div className="">
          <Header onSave={handleSave} />
        </div>
      )}
      <div className="flex-1 bg-primaryA-100 overflow-hidden flex gap-2 px-2 pb-2">
        {ui.showToolbox && !isViewMode && (
          <div>
            <Toolbox />
          </div>
        )}

        <div className="flex-1 rounded-2xl overflow-hidden relative">
          {ui.showBehavior && !isViewMode && (
            <UndoRedo className="absolute top-2 left-2 z-1" />
          )}
          <Canvas
            onNodeDrop={isViewMode ? undefined : handleNodeDrop}
            isPanMode={isPanMode}
            onPanModeChange={setIsPanMode}
            showMinimap={ui.showMinimap && showMinimap}
          />
        </div>

        {ui.showPropertiesPanel && (selectedNode || selectedEdge) && (
          <div className="relative h-full">
            <PropertiesPanel />
          </div>
        )}

        {ui.showValidationPanel && !isViewMode && (
          <ValidationPanel onNodeSelect={handleNodeSelect} />
        )}

        {ui.showToolbar && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <Toolbar
              isPanMode={isPanMode}
              onPanModeChange={setIsPanMode}
              showMinimap={showMinimap}
              onMinimapToggle={setShowMinimap}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Workflow Builder Props
 */
export interface WorkflowBuilderProps extends Omit<
  WorkflowCoreProps,
  "children"
> {
  /**
   * Optional: Custom layout component
   * If not provided, uses default layout
   */
  customLayout?: React.ComponentType<{ children?: React.ReactNode }>;

  /**
   * UI Configuration for showing/hiding components
   */
  uiConfig?: WorkflowUIConfig;
}

/**
 * WorkflowBuilder - Default implementation with standard layout
 * For custom layouts, use WorkflowCore instead
 */
export default function WorkflowBuilder({
  pluginOptions,
  customLayout: CustomLayout,
  initProperties = true,
  uiConfig,
}: WorkflowBuilderProps = {}) {
  return (
    <WorkflowCore pluginOptions={pluginOptions} initProperties={initProperties}>
      {CustomLayout ? (
        <CustomLayout>
          <WorkflowBuilderInner uiConfig={uiConfig} />
        </CustomLayout>
      ) : (
        <WorkflowBuilderInner uiConfig={uiConfig} />
      )}
    </WorkflowCore>
  );
}

// Named export for consistency
export { WorkflowBuilder };
