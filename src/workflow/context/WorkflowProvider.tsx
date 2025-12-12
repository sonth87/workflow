/**
 * Workflow Provider
 * Initialize core system và provide workflow context
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { pluginManager, type Plugin } from "@/core/plugins/PluginManager";
import { defaultBpmPlugin } from "@/plugins/defaultBpmPlugin";

interface WorkflowContextValue {
  isInitialized: boolean;
  error: Error | null;
}

const WorkflowContext = createContext<WorkflowContextValue>({
  isInitialized: false,
  error: null,
});

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
}

/**
 * Plugin configuration options
 */
export interface PluginOptions {
  /**
   * Enable/disable default BPM plugin
   * @default true
   */
  enableDefaultPlugin?: boolean;

  /**
   * Auto-activate plugins after installation
   * @default true
   */
  autoActivate?: boolean;

  /**
   * Additional plugins to install
   */
  plugins?: Plugin[];
}

interface WorkflowProviderProps {
  children: ReactNode;
  /**
   * Plugin configuration options
   */
  pluginOptions?: PluginOptions;
}

export function WorkflowProvider({
  children,
  pluginOptions = {},
}: WorkflowProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    enableDefaultPlugin = true,
    autoActivate = true,
    plugins = [],
  } = pluginOptions;

  useEffect(() => {
    async function initializeWorkflow() {
      try {
        // Install default BPM plugin
        if (enableDefaultPlugin) {
          if (!pluginManager.isInstalled("default-bpm-plugin")) {
            await pluginManager.install(defaultBpmPlugin);
          }

          // Activate default plugin
          if (autoActivate && !pluginManager.isActive("default-bpm-plugin")) {
            await pluginManager.activate("default-bpm-plugin");
          }
        }

        // Install and activate custom plugins
        for (const plugin of plugins) {
          const pluginId = plugin.metadata.id;

          if (!pluginManager.isInstalled(pluginId)) {
            await pluginManager.install(plugin);
            console.log(`✅ Plugin installed: ${plugin.metadata.name}`);
          }

          if (autoActivate && !pluginManager.isActive(pluginId)) {
            await pluginManager.activate(pluginId);
            console.log(`✅ Plugin activated: ${plugin.metadata.name}`);
          }
        }

        setIsInitialized(true);
        console.log("✅ Workflow system initialized");
      } catch (err) {
        console.error("❌ Failed to initialize workflow system:", err);
        setError(err as Error);
      }
    }

    initializeWorkflow();
  }, [enableDefaultPlugin, autoActivate, plugins]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to initialize workflow system
          </h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing workflow system...</p>
        </div>
      </div>
    );
  }

  return (
    <WorkflowContext.Provider value={{ isInitialized, error }}>
      {children}
    </WorkflowContext.Provider>
  );
}
