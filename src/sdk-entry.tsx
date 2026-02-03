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
import { translationRegistry } from "./core/registry/TranslationRegistry";
import type { CustomNodeJSON, PluginJSON } from "./core";
import type {
  WorkflowState,
  WorkflowActions,
} from "./core/store/workflowStore";
import type { BaseNodeConfig, BaseEdgeConfig } from "./core/types/base.types";

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
  defaultLanguage?: string;
  // Translation support (flat key-based system)
  translations?: Record<string, string> | string; // Inline object or URL
  translationsUrl?: string; // Alternative way to specify URL
  onReady?: () => void;
  onError?: (error: Error) => void;
}

class BPMCore {
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  private config: BPMConfig;
  public eventBus: typeof globalEventBus;
  private languageSetter: ((language: string) => void) | null = null;
  private languagesGetter: (() => string[]) | null = null;
  private currentLanguage: string = "en";
  private storeGetter: (() => WorkflowState & WorkflowActions) | null = null;
  private themeGetter:
    | (() => { theme: string; setTheme: (theme: string) => void })
    | null = null;
  private themeSetter: ((theme: string) => void) | null = null;

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
    this.currentLanguage = config.defaultLanguage || "en";
    this.eventBus = globalEventBus;
    this.init();
  }

  private async init() {
    try {
      // Load language from centralized storage
      if (typeof window !== "undefined") {
        const { getSetting } = await import("./utils/storage");
        const stored = getSetting("language");
        if (stored) {
          this.currentLanguage = stored as string;
        }
      }

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
          const win = window as Window & {
            __BPM_CORE_INSTANCE__?: BPMCore;
            __BPM_CORE_ON_READY__?: (() => void) | null;
          };
          win.__BPM_CORE_INSTANCE__ = this;
          // Store onReady callback to be called from WorkflowProvider after language setter is registered
          win.__BPM_CORE_ON_READY__ = this.config.onReady;
        }
      } else {
        // If no onReady callback, still register instance
        if (typeof window !== "undefined") {
          const win = window as Window & { __BPM_CORE_INSTANCE__?: BPMCore };
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
    // Load translations first (before nodes, so keys can be resolved)
    // This won't throw errors - just logs warnings
    await this.loadTranslations();

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

  /**
   * Load translations from config or URL
   * Called internally during initialization and can be called externally for dynamic loading
   * Note: Errors are caught and logged, but won't prevent initialization
   */
  private async loadTranslations(): Promise<void> {
    const language = this.currentLanguage;

    try {
      // Load from translations option (inline object or URL)
      if (this.config.translations) {
        if (typeof this.config.translations === "string") {
          // It's a URL
          await translationRegistry.loadFromUrl(
            this.config.translations,
            language
          );
        } else if (typeof this.config.translations === "object") {
          // It's an inline object
          translationRegistry.register(language, this.config.translations);
        }
      }

      // Load from translationsUrl option
      if (this.config.translationsUrl) {
        await translationRegistry.loadFromUrl(
          this.config.translationsUrl,
          language
        );
      }
    } catch (error) {
      // Log error but don't throw - translations are optional
      console.warn(
        `[BPM SDK] Could not load translations. If using file:// protocol, consider:
1. Serve files via HTTP server (e.g., python -m http.server or npx serve)
2. Pass translations as inline object instead of URL
3. Use React library integration for local development

Error:`,
        error
      );
    }
  }

  /**
   * Public method to dynamically load translations for a specific language
   * @param urlOrLanguage - URL to translation file or language code
   * @param translations - Optional translations object (if first param is language code)
   */
  async loadTranslationsForLanguage(
    urlOrLanguage: string,
    translations?: Record<string, string>
  ): Promise<void> {
    try {
      if (translations) {
        // First param is language code, second is translations object
        translationRegistry.register(urlOrLanguage, translations);
      } else if (
        urlOrLanguage.includes(".json") ||
        urlOrLanguage.startsWith("http")
      ) {
        // It's a URL
        await translationRegistry.loadFromUrl(urlOrLanguage);
      } else {
        console.warn(
          `[BPM SDK] loadTranslationsForLanguage: Invalid parameters. Expected URL or (language, translations object)`
        );
      }
    } catch (error) {
      console.error("[BPM SDK] Error loading translations:", error);
      throw error;
    }
  }

  on(
    event: string,
    handler: (event: { type: string; payload?: unknown }) => void
  ) {
    return this.eventBus.on(event, handler);
  }

  emit(event: string, payload?: unknown) {
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
        import("./utils/storage").then(({ setSetting }) => {
          setSetting("language", language);
        });
      }
    }
  }

  getAvailableLanguages(): string[] {
    if (this.languagesGetter) {
      return this.languagesGetter();
    }
    console.warn(
      `[BPM SDK] Languages getter not registered yet, returning defaults`
    );
    return ["en", "vi"];
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

  _registerLanguagesGetter(getter: () => string[]) {
    this.languagesGetter = getter;
  }

  _setCurrentLanguage(language: string) {
    this.currentLanguage = language;
  }

  _registerStoreGetter(getter: () => WorkflowState & WorkflowActions) {
    this.storeGetter = getter;
  }

  _registerThemeGetter(
    getter: () => { theme: string; setTheme: (theme: string) => void }
  ) {
    this.themeGetter = getter;
  }

  _registerThemeSetter(setter: (theme: string) => void) {
    this.themeSetter = setter;
  }

  // ========== History Methods ==========
  undo() {
    if (this.storeGetter) {
      const store = this.storeGetter();
      if (store && typeof store.undo === "function") {
        store.undo();
      }
    }
  }

  redo() {
    if (this.storeGetter) {
      const store = this.storeGetter();
      if (store && typeof store.redo === "function") {
        store.redo();
      }
    }
  }

  canUndo(): boolean {
    if (this.storeGetter) {
      const store = this.storeGetter();
      if (store && store.history) {
        return store.history.past.length > 0;
      }
    }
    return false;
  }

  canRedo(): boolean {
    if (this.storeGetter) {
      const store = this.storeGetter();
      if (store && store.history) {
        return store.history.future.length > 0;
      }
    }
    return false;
  }

  // ========== Theme Methods ==========
  getTheme(): string {
    if (this.themeGetter) {
      const theme = this.themeGetter();
      return theme?.theme || "system";
    }
    return "system";
  }

  setTheme(theme: "light" | "dark" | "system") {
    if (this.themeSetter) {
      this.themeSetter(theme);
    }
  }

  setLightMode() {
    this.setTheme("light");
  }

  setDarkMode() {
    this.setTheme("dark");
  }

  setSystemMode() {
    this.setTheme("system");
  }

  toggleTheme() {
    const current = this.getTheme();
    if (current === "light") this.setDarkMode();
    else if (current === "dark") this.setSystemMode();
    else this.setLightMode();
  }

  // ========== Workflow State Methods ==========
  getWorkflow() {
    if (this.storeGetter) {
      const store = this.storeGetter();
      if (store) {
        return {
          nodes: store.nodes || [],
          edges: store.edges || [],
          workflowName: store.workflowName || "Untitled Workflow",
          workflowDescription: store.workflowDescription || "",
        };
      }
    }
    return { nodes: [], edges: [], workflowName: "", workflowDescription: "" };
  }

  getNodes() {
    if (this.storeGetter) {
      const store = this.storeGetter();
      return store?.nodes || [];
    }
    return [];
  }

  getEdges() {
    if (this.storeGetter) {
      const store = this.storeGetter();
      return store?.edges || [];
    }
    return [];
  }

  clearWorkflow() {
    if (this.storeGetter) {
      const store = this.storeGetter();
      if (store && typeof store.clearWorkflow === "function") {
        store.clearWorkflow();
      }
    }
  }

  // ========== Import/Export Methods ==========
  importWorkflow(data: {
    nodes?: BaseNodeConfig[];
    edges?: BaseEdgeConfig[];
    metadata?: { name?: string; description?: string };
    workflowName?: string;
    workflowDescription?: string;
  }) {
    if (this.storeGetter) {
      const store = this.storeGetter();
      if (store && typeof store.loadWorkflow === "function") {
        store.loadWorkflow({
          nodes: data.nodes || [],
          edges: data.edges || [],
          workflowName: data.metadata?.name || data.workflowName,
          workflowDescription:
            data.metadata?.description || data.workflowDescription,
        });
      }
    }
  }

  exportWorkflow(includeMetadata = true) {
    const workflow = this.getWorkflow();
    const data: {
      nodes: unknown[];
      edges: unknown[];
      metadata?: {
        name: string;
        description: string;
        version: string;
        exportedAt: string;
      };
    } = {
      nodes: workflow.nodes,
      edges: workflow.edges,
    };

    if (includeMetadata) {
      data.metadata = {
        name: workflow.workflowName,
        description: workflow.workflowDescription,
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
      };
    }

    return data;
  }

  downloadWorkflow(filename = "workflow.json") {
    const data = this.exportWorkflow();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  uploadWorkflow(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error("No file selected"));
          return;
        }

        try {
          const text = await file.text();
          const data = JSON.parse(text);
          this.importWorkflow(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }

  viewWorkflow() {
    return this.getWorkflow();
  }

  // ========== Validation Methods ==========
  getValidationErrors() {
    if (this.storeGetter) {
      const store = this.storeGetter();
      return store?.validationErrors || [];
    }
    return [];
  }

  hasErrors(): boolean {
    return this.getValidationErrors().length > 0;
  }

  async validate() {
    // Trigger validation via event bus
    this.eventBus.emit("workflow:validate", {});
    // Wait a bit for validation to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      valid: !this.hasErrors(),
      errors: this.getValidationErrors(),
    };
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
