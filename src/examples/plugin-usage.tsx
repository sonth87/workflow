/**
 * Plugin Usage Examples
 * Các ví dụ sử dụng plugin system
 */

import React from "react";
import WorkflowBuilder from "../workflow";
import { customPlugin } from "../plugins/customPlugin";
import { aiMLPlugin } from "../plugins/aiMLPlugin";

/**
 * Example 1: Sử dụng default plugin only
 */
export function Example1_DefaultOnly() {
  return <WorkflowBuilder />;
}

/**
 * Example 2: Thêm custom plugin
 */
export function Example2_WithCustomPlugin() {
  return (
    <WorkflowBuilder
      pluginOptions={{
        plugins: [customPlugin],
      }}
    />
  );
}

/**
 * Example 3: Multiple plugins
 */
export function Example3_MultiplePlugins() {
  return (
    <WorkflowBuilder
      pluginOptions={{
        plugins: [customPlugin, aiMLPlugin],
      }}
    />
  );
}

/**
 * Example 4: Tắt default plugin
 */
export function Example4_CustomPluginOnly() {
  return (
    <WorkflowBuilder
      pluginOptions={{
        enableDefaultPlugin: false,
        plugins: [customPlugin],
      }}
    />
  );
}

/**
 * Example 5: Manual activation control
 */
export function Example5_ManualActivation() {
  return (
    <WorkflowBuilder
      pluginOptions={{
        autoActivate: false, // Manual activation
        plugins: [customPlugin, aiMLPlugin],
      }}
    />
  );
}

/**
 * Example 6: Dynamic plugin loading
 */
export function Example6_DynamicPlugins() {
  const [plugins, setPlugins] = React.useState([customPlugin]);

  const addAIPlugin = () => {
    setPlugins([customPlugin, aiMLPlugin]);
  };

  return (
    <div>
      <button onClick={addAIPlugin}>Load AI/ML Plugin</button>
      <WorkflowBuilder
        pluginOptions={{
          plugins: plugins,
        }}
      />
    </div>
  );
}

/**
 * Example 7: Conditional plugins
 */
export function Example7_ConditionalPlugins() {
  const userHasAIAccess = true; // từ user permissions
  const userHasCustomAccess = true;

  const plugins = [
    ...(userHasCustomAccess ? [customPlugin] : []),
    ...(userHasAIAccess ? [aiMLPlugin] : []),
  ];

  return (
    <WorkflowBuilder
      pluginOptions={{
        plugins: plugins,
      }}
    />
  );
}

/**
 * Example 8: Complete configuration
 */
export function Example8_CompleteConfig() {
  return (
    <WorkflowBuilder
      pluginOptions={{
        // Enable default BPM components
        enableDefaultPlugin: true,

        // Auto-activate all plugins
        autoActivate: true,

        // Additional custom plugins
        plugins: [
          customPlugin,  // Custom components
          aiMLPlugin,    // AI/ML workflow components
        ],
      }}
    />
  );
}

/**
 * Using with programmatic API
 */
export function Example9_ProgrammaticAPI() {
  React.useEffect(() => {
    // Import plugin manager
    import("@/core/plugins/PluginManager").then(({ pluginManager }) => {
      // Check plugin status
      const isInstalled = pluginManager.isInstalled("custom-plugin");
      const isActive = pluginManager.isActive("custom-plugin");

      console.log("Custom Plugin Status:", {
        installed: isInstalled,
        active: isActive,
      });

      // Get all plugins
      const allPlugins = pluginManager.getAllPlugins();
      console.log("All plugins:", allPlugins);
    });
  }, []);

  return (
    <WorkflowBuilder
      pluginOptions={{
        plugins: [customPlugin],
      }}
    />
  );
}
