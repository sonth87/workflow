/**
 * WorkflowCore - Core component with only providers, no UI
 * Use this when you want full control over the layout
 */

import type { ReactNode } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import {
  WorkflowProvider,
  type PluginOptions,
} from "./context/WorkflowProvider";
import { WorkflowActionsProvider } from "./context/WorkflowActionsProvider";
import { initializePropertySystem } from "@/core/properties";

export interface WorkflowCoreProps {
  /**
   * Plugin configuration options
   */
  pluginOptions?: PluginOptions;

  /**
   * Children components - you have full control over the layout
   */
  children: ReactNode;

  /**
   * Initialize property system automatically (default: true)
   */
  initProperties?: boolean;
}

/**
 * WorkflowCore provides only the core providers without any UI.
 * This allows full customization of the layout and components.
 *
 * @example
 * ```tsx
 * <WorkflowCore>
 *   <div className="my-layout">
 *     <MyHeader />
 *     <div className="flex">
 *       <Toolbox />
 *       <Canvas />
 *       <PropertiesPanel />
 *     </div>
 *   </div>
 * </WorkflowCore>
 * ```
 */
export function WorkflowCore({
  pluginOptions,
  children,
  initProperties = true,
}: WorkflowCoreProps) {
  // Initialize property system
  if (initProperties) {
    initializePropertySystem();
  }

  return (
    <WorkflowProvider pluginOptions={pluginOptions}>
      <ReactFlowProvider>
        <WorkflowActionsProvider>{children}</WorkflowActionsProvider>
      </ReactFlowProvider>
    </WorkflowProvider>
  );
}
