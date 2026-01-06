// SDK Entry Point
import { createRoot } from "react-dom/client";
import WorkflowBuilder from "./workflow";
import "@xyflow/react/dist/style.css";
import "./index.css";
import "@sth87/shadcn-design-system/index.css";
import "@sth87/shadcn-design-system/animation.css";

// Expose global API
interface BPMConfig {
  container?: string | HTMLElement;
  pluginOptions?: {
    enableDefaultPlugin?: boolean;
    autoActivate?: boolean;
    plugins?: any[];
  };
  onReady?: () => void;
  onError?: (error: Error) => void;
}

class BPMCore {
  private root: any = null;
  private container: HTMLElement | null = null;
  private config: BPMConfig;

  constructor(config: BPMConfig) {
    this.config = config;
    this.init();
  }

  private init() {
    try {
      // Get container
      if (typeof this.config.container === "string") {
        this.container = document.querySelector(this.config.container);
      } else if (this.config.container instanceof HTMLElement) {
        this.container = this.config.container;
      }

      if (!this.container) {
        throw new Error("BPM: Container not found");
      }

      // Create React root and render
      this.root = createRoot(this.container);
      this.root.render(
        <WorkflowBuilder pluginOptions={this.config.pluginOptions || {}} />
      );

      // Call ready callback
      if (typeof this.config.onReady === "function") {
        // Wait for next tick to ensure render is complete
        setTimeout(() => {
          this.config.onReady!();
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
    this.config = { ...this.config, ...config };
    if (this.root && this.container) {
      this.root.render(
        <WorkflowBuilder pluginOptions={this.config.pluginOptions || {}} />
      );
    }
  }
}

// Register renderer for SDK loader
if (typeof window !== "undefined") {
  (window as any).__BPM_CORE__ = BPMCore;

  // Process pending requests from SDK loader
  const requests = (window as any).__SKYLINE_SDK_REQUESTS__?.["bpm"] || [];
  requests.forEach((request: any) => {
    try {
      const container = request.selector || request.options?.container;
      new BPMCore({
        container,
        ...request.options,
      });
    } catch (error) {
      console.error("Error processing BPM request:", error);
    }
  });

  // Register renderer for future requests
  if ((window as any).__SKYLINE_SDK_RENDERERS__) {
    (window as any).__SKYLINE_SDK_RENDERERS__["bpm"] = function (request: any) {
      const container = request.selector || request.options?.container;
      new BPMCore({
        container,
        ...request.options,
      });
    };
  }
}

export default BPMCore;
