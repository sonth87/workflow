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
import { pluginManager } from "@/core/plugins/PluginManager";
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

interface WorkflowProviderProps {
  children: ReactNode;
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializeWorkflow() {
      try {
        // Install default BPM plugin
        if (!pluginManager.isInstalled("default-bpm-plugin")) {
          await pluginManager.install(defaultBpmPlugin);
        }

        // Activate plugin
        if (!pluginManager.isActive("default-bpm-plugin")) {
          await pluginManager.activate("default-bpm-plugin");
        }

        setIsInitialized(true);
        console.log("✅ Workflow system initialized");
      } catch (err) {
        console.error("❌ Failed to initialize workflow system:", err);
        setError(err as Error);
      }
    }

    initializeWorkflow();
  }, []);

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
