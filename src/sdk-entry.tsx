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
import { CustomNodeFactory, PluginJSONLoader, globalEventBus } from "./core";
import type { CustomNodeJSON, PluginJSON } from "./core";
import type { UITranslations } from "./workflow/translations/ui.translations";

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
  // JSON config support
  customNodes?: CustomNodeJSON[];
  customNodesUrl?: string;
  pluginsFromJSON?: PluginJSON[];
  pluginUrls?: string[];
  // Language configuration
  uiTranslations?: UITranslations;
  defaultLanguage?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

class BPMCore {
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  private config: BPMConfig;
  public eventBus: typeof globalEventBus;
  private languageSetter: ((language: string) => void) | null = null;
  private currentLanguage: string = "en";

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
    // Initialize from localStorage first (to match LanguageProvider behavior)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bpm-language");
      this.currentLanguage = stored || config.defaultLanguage || "en";
    } else {
      this.currentLanguage = config.defaultLanguage || "en";
    }
    this.eventBus = globalEventBus;
    this.init();
  }

  private async init() {
    try {
      // Process JSON configurations first
      await this.loadJSONConfigs();

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
        pluginOptions: {
          ...(this.config.pluginOptions || {}),
          languageConfig: {
            defaultLanguage: this.config.defaultLanguage || "en",
            uiTranslations: this.config.uiTranslations,
          },
        },
        uiConfig: this.config.ui,
      };
      this.root.render(
        createElement(
          WorkflowBuilder as React.ComponentType<WorkflowBuilderProps>,
          props
        )
      );

      if (typeof this.config.onReady === "function") {
        // Register this instance globally for language setter callback
        if (typeof window !== "undefined") {
          const win = window as any;
          win.__BPM_CORE_INSTANCE__ = this;
          // Store onReady callback to be called from WorkflowProvider after language setter is registered
          win.__BPM_CORE_ON_READY__ = this.config.onReady;
        }
      } else {
        // If no onReady callback, still register instance
        if (typeof window !== "undefined") {
          const win = window as any;
          win.__BPM_CORE_INSTANCE__ = this;
        }
      }
    } catch (error) {
      console.error("BPM initialization error:", error);
      if (typeof this.config.onError === "function") {
        this.config.onError(error as Error);
      }
    }
  }

  private async loadJSONConfigs() {
    try {
      // Load custom nodes from inline config
      if (this.config.customNodes && Array.isArray(this.config.customNodes)) {
        const result = CustomNodeFactory.registerMany(this.config.customNodes);
        console.log(
          `[BPM SDK] Loaded ${result.success} custom nodes from config`
        );
        if (result.failed > 0) {
          console.warn(
            `[BPM SDK] Failed to load ${result.failed} nodes:`,
            result.errors
          );
        }
      }

      // Load plugins from inline JSON config
      if (
        this.config.pluginsFromJSON &&
        Array.isArray(this.config.pluginsFromJSON)
      ) {
        const plugins = PluginJSONLoader.loadPlugins(
          this.config.pluginsFromJSON
        );

        // Add plugins to pluginOptions
        if (!this.config.pluginOptions) {
          this.config.pluginOptions = {};
        }
        if (!this.config.pluginOptions.plugins) {
          this.config.pluginOptions.plugins = [];
        }
        this.config.pluginOptions.plugins.push(...plugins);

        console.log(
          `[BPM SDK] Loaded ${plugins.length} plugins from JSON config`
        );
      }
    } catch (error) {
      console.error("[BPM SDK] Error loading JSON configs:", error);
      throw error;
    }
  }

  on(event: string, handler: (event: any) => void) {
    return this.eventBus.on(event, handler);
  }

  emit(event: string, payload?: any) {
    this.eventBus.emit(event, payload);
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.container = null;
  }

  getLanguage(): string {
    console.log(`[BPM SDK] getLanguage() = ${this.currentLanguage}`);
    return this.currentLanguage;
  }

  setLanguage(language: string) {
    console.log(`[BPM SDK] setLanguage(${language})`);
    this.currentLanguage = language;
    if (this.languageSetter) {
      this.languageSetter(language);
      console.log(`[BPM SDK] Language setter called successfully`);
    } else {
      console.warn(
        `[BPM SDK] Language setter not registered yet, saving to localStorage`
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("bpm-language", language);
      }
    }
  }

  _registerLanguageSetter(
    setter: (language: string) => void,
    currentLanguage?: string
  ) {
    this.languageSetter = setter;
    // Always sync current language from context (LanguageProvider loads from localStorage)
    if (currentLanguage && currentLanguage !== this.currentLanguage) {
      console.log(
        `[BPM SDK] Language synced: ${this.currentLanguage} → ${currentLanguage}`
      );
      this.currentLanguage = currentLanguage;
    }
  }

  _setCurrentLanguage(language: string) {
    this.currentLanguage = language;
  }

  update(config: Partial<BPMConfig>) {
    this.config = {
      ...this.config,
      ...config,
      ui: { ...this.config.ui, ...config.ui },
    };
    if (this.root && this.container) {
      const props: WorkflowBuilderProps = {
        pluginOptions: {
          ...(this.config.pluginOptions || {}),
          languageConfig: {
            defaultLanguage: this.config.defaultLanguage || "en",
            uiTranslations: this.config.uiTranslations,
          },
        },
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
