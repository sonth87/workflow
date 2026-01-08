// SDK Entry Point
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
// Import as named export then assign to WorkflowBuilder
import * as WorkflowModule from "./workflow/index.js";
import type {
  PluginOptions,
  WorkflowUIConfig,
  WorkflowBuilderProps,
} from "./workflow";

const WorkflowBuilder = WorkflowModule.default;
import "@xyflow/react/dist/style.css";
import "./index.css";
import "@sth87/shadcn-design-system/index.css";
import "@sth87/shadcn-design-system/animation.css";

// Use WorkflowUIConfig directly from workflow export
type BPMUIConfig = WorkflowUIConfig;

interface BPMConfig {
  container?: string | HTMLElement;
  pluginOptions?: PluginOptions;
  ui?: BPMUIConfig;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

class BPMCore {
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  private config: BPMConfig;

  constructor(config: BPMConfig) {
    this.config = {
      ...config,
      ui: {
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
        ...config.ui,
      },
    };
    this.init();
  }

  private init() {
    try {
      if (typeof this.config.container === "string") {
        this.container = document.querySelector(this.config.container);
      } else if (this.config.container instanceof HTMLElement) {
        this.container = this.config.container;
      }

      if (!this.container) {
        throw new Error("BPM: Container not found");
      }

      this.root = createRoot(this.container);
      const props: WorkflowBuilderProps = {
        pluginOptions: this.config.pluginOptions || {},
        uiConfig: this.config.ui,
      };
      this.root.render(
        createElement(
          WorkflowBuilder as React.ComponentType<WorkflowBuilderProps>,
          props
        )
      );

      if (typeof this.config.onReady === "function") {
        setTimeout(() => {
          if (this.config.onReady) {
            this.config.onReady();
          }
        }, 0);
      }
    } catch (error) {
      console.error("BPM initialization error:", error);
      if (typeof this.config.onError === "function") {
        this.config.onError(error as Error);
      }
    }
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.container = null;
  }

  update(config: Partial<BPMConfig>) {
    this.config = {
      ...this.config,
      ...config,
      ui: { ...this.config.ui, ...config.ui },
    };
    if (this.root && this.container) {
      const props: WorkflowBuilderProps = {
        pluginOptions: this.config.pluginOptions || {},
        uiConfig: this.config.ui,
      };
      this.root.render(
        createElement(
          WorkflowBuilder as React.ComponentType<WorkflowBuilderProps>,
          props
        )
      );
    }
  }
}

if (typeof window !== "undefined") {
  interface WindowWithBPM extends Window {
    __BPM_CORE__: typeof BPMCore;
    __SKYLINE_SDK_REQUESTS__?: {
      bpm?: Array<{ selector?: string; options?: BPMConfig }>;
    };
    __SKYLINE_SDK_RENDERERS__?: {
      bpm?: (request: { selector?: string; options?: BPMConfig }) => void;
    };
    BPM: typeof BPMCore;
  }

  const win = window as unknown as WindowWithBPM;
  win.__BPM_CORE__ = BPMCore;
  win.BPM = BPMCore;

  const requests = win.__SKYLINE_SDK_REQUESTS__?.bpm || [];
  requests.forEach(request => {
    try {
      const container = request.selector || request.options?.container;
      new BPMCore({ container, ...request.options });
    } catch (error) {
      console.error("Error processing BPM request:", error);
    }
  });

  if (win.__SKYLINE_SDK_RENDERERS__) {
    win.__SKYLINE_SDK_RENDERERS__.bpm = function (request) {
      const container = request.selector || request.options?.container;
      new BPMCore({ container, ...request.options });
    };
  }
}

export default BPMCore;
