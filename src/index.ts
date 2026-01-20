/**
 * BPM Core SDK - Public API
 * Main export file for the BPM workflow library
 */

// ==================== Core ====================
export * from "./core";

// ==================== Store ====================
export { useWorkflowStore } from "./core/store/workflowStore";
export type {
  WorkflowState,
  WorkflowActions,
} from "./core/store/workflowStore";

// ==================== Workflow Core ====================
// Core component without UI
export { WorkflowCore, type WorkflowCoreProps } from "./workflow/WorkflowCore";

// Default builder with standard layout
export { default as WorkflowBuilder } from "./workflow";
export type { WorkflowBuilderProps, PluginOptions } from "./workflow";

// ==================== Workflow Hooks ====================
export * from "./workflow/hooks";

// ==================== Additional Hooks ====================
export { useTheme } from "./hooks/useTheme";
export { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

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

// ==================== i18n / Internationalization ====================
export {
  LanguageProvider,
  useLanguageContext,
  type LanguageType,
} from "./workflow/context/LanguageContext";
export {
  DEFAULT_UI_TRANSLATIONS,
  type UITranslations,
} from "./workflow/translations/ui.translations";
export { LanguageSwitcher } from "./workflow/components/LanguageSwitcher";

// ==================== Utils ====================
export { cx } from "./utils/cx";
export { getNestedValue } from "./utils/nested-value";
