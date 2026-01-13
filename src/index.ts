/**
 * BPM Core SDK - Public API
 * Main export file for the BPM workflow library
 */

// ==================== Core ====================
export * from "./core";

// ==================== Workflow Core ====================
// Core component without UI
export { WorkflowCore, type WorkflowCoreProps } from "./workflow/WorkflowCore";

// Default builder with standard layout
export { default as WorkflowBuilder } from "./workflow";
export type { WorkflowBuilderProps, PluginOptions } from "./workflow";

// ==================== Workflow Hooks ====================
export * from "./workflow/hooks";

// ==================== Workflow Controls ====================
// Modular, reusable UI controls
export * from "./workflow/controls";

// ==================== Workflow Components ====================
// Larger composite components
export {
  Canvas,
  Toolbox,
  PropertiesPanel,
  ValidationPanel,
  Header,
  Toolbar,
  UndoRedo,
  ExportWorkflow,
  ImportWorkflow,
  LayoutSwitcher,
  OutputViewer,
  Run,
  ThemeSwitcher,
  ViewModeSwitcher,
  Shortcuts,
} from "./workflow/components";

// ==================== Context ====================
export { WorkflowProvider } from "./workflow/context/WorkflowProvider";
export { WorkflowActionsProvider } from "./workflow/context/WorkflowActionsProvider";

// ==================== Utils ====================
export { cx } from "./utils/cx";
export { getNestedValue } from "./utils/nested-value";
