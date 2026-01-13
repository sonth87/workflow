/**
 * JSON Configuration Integration Examples
 * Các ví dụ tích hợp bpm-core sử dụng JSON configuration
 */

import React from "react";
import { WorkflowBuilder } from "../workflow";
import {
  CustomNodeFactory,
  PluginJSONLoader,
  type CustomNodeJSON,
  type PluginJSON,
} from "../core";

/**
 * Example 1: Load single custom node from JSON
 */
export function Example1_SingleNodeFromJSON() {
  React.useEffect(() => {
    // Define node config as JSON
    const nodeConfig = {
      id: "sendEmailTask",
      extends: "task",
      name: "Send Email",
      description: "Send email notification",
      icon: {
        type: "lucide",
        value: "Mail",
        color: "#ffffff",
        backgroundColor: "#e74c3c",
      },
      properties: [
        {
          id: "to",
          name: "to",
          label: "To",
          type: "text",
          required: true,
          placeholder: "email@example.com",
          group: "basic",
          order: 1,
        },
        {
          id: "subject",
          name: "subject",
          label: "Subject",
          type: "text",
          required: true,
          group: "basic",
          order: 2,
        },
        {
          id: "body",
          name: "body",
          label: "Body",
          type: "textarea",
          required: true,
          group: "basic",
          order: 3,
        },
      ],
      defaultProperties: {
        label: "Send Email",
      },
    } as CustomNodeJSON;

    // Register node from JSON config
    CustomNodeFactory.registerFromConfig(nodeConfig);
  }, []);

  return <WorkflowBuilder />;
}

/**
 * Example 2: Load multiple nodes from JSON array
 */
export function Example2_MultipleNodesFromJSON() {
  React.useEffect(() => {
    const nodesConfig = [
      {
        id: "sendEmailTask",
        extends: "task" as const,
        name: "Send Email",
        description: "Send email notification",
        properties: [
          {
            id: "to",
            name: "to",
            label: "To",
            type: "text",
            required: true,
            group: "basic",
          },
        ],
      },
      {
        id: "httpRequestTask",
        extends: "task" as const,
        name: "HTTP Request",
        description: "Make HTTP request",
        properties: [
          {
            id: "url",
            name: "url",
            label: "URL",
            type: "text",
            required: true,
            group: "basic",
          },
          {
            id: "method",
            name: "method",
            label: "Method",
            type: "select",
            required: true,
            defaultValue: "GET",
            group: "basic",
            options: [
              { label: "GET", value: "GET" },
              { label: "POST", value: "POST" },
            ],
          },
        ],
      },
    ] as CustomNodeJSON[];

    // Register multiple nodes
    const result = CustomNodeFactory.registerMany(nodesConfig);
    console.log(`Loaded ${result.success} nodes, ${result.failed} failed`);
  }, []);

  return <WorkflowBuilder />;
}

/**
 * Example 3: Load nodes from JSON file
 */
export function Example3_LoadFromJSONFile() {
  React.useEffect(() => {
    // Load from JSON file (assumed to be imported)
    import("../../examples/json-configs/email-node.json").then(jsonConfig => {
      const result = CustomNodeFactory.registerMany(
        jsonConfig.default as CustomNodeJSON[]
      );
      console.log(`Loaded ${result.success} nodes from JSON file`);
    });
  }, []);

  return <WorkflowBuilder />;
}

/**
 * Example 4: Load nodes from URL
 */
export function Example4_LoadFromURL() {
  React.useEffect(() => {
    // Load from remote URL
    CustomNodeFactory.loadFromURL("https://example.com/custom-nodes.json").then(
      result => {
        console.log(`Loaded ${result.success} nodes from URL`);
      }
    );
  }, []);

  return <WorkflowBuilder />;
}

/**
 * Example 5: Load complete plugin from JSON
 */
export function Example5_LoadPluginFromJSON() {
  const [plugin, setPlugin] = React.useState<any>(null);

  React.useEffect(() => {
    // Load plugin config from JSON file
    import("../../examples/json-configs/complete-plugin.json").then(
      jsonConfig => {
        const loadedPlugin = PluginJSONLoader.loadPlugin(
          jsonConfig.default as PluginJSON
        );
        setPlugin(loadedPlugin);
      }
    );
  }, []);

  return (
    <WorkflowBuilder
      pluginOptions={{
        plugins: plugin ? [plugin] : [],
      }}
    />
  );
}

/**
 * Example 6: Load plugin from URL
 */
export function Example6_LoadPluginFromURL() {
  const [plugin, setPlugin] = React.useState<any>(null);

  React.useEffect(() => {
    PluginJSONLoader.loadPluginFromURL(
      "https://example.com/my-plugin.json"
    ).then(loadedPlugin => {
      setPlugin(loadedPlugin);
    });
  }, []);

  return (
    <WorkflowBuilder
      pluginOptions={{
        plugins: plugin ? [plugin] : [],
      }}
    />
  );
}

/**
 * Example 7: Node with custom properties and context menu
 */
export function Example7_CustomPropertiesAndContextMenu() {
  React.useEffect(() => {
    const nodeConfig = {
      id: "advancedTask",
      extends: "task" as const,
      name: "Advanced Task",
      description: "Task with custom properties and context menu",
      properties: [
        {
          id: "priority",
          name: "priority",
          label: "Priority",
          type: "select",
          required: true,
          defaultValue: "medium",
          group: "config",
          options: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ],
        },
        {
          id: "assignee",
          name: "assignee",
          label: "Assignee",
          type: "text",
          required: false,
          group: "config",
        },
        {
          id: "dueDate",
          name: "dueDate",
          label: "Due Date",
          type: "date",
          required: false,
          group: "config",
        },
      ],
      propertyGroups: [
        {
          id: "config",
          label: "Configuration",
          icon: "Settings",
          order: 2,
        },
      ],
      contextMenuItems: [
        {
          id: "mark-complete",
          label: "Mark as Complete",
          icon: "CheckCircle",
          action: {
            type: "event",
            event: "custom:task-completed",
          },
        },
        {
          id: "assign-to-me",
          label: "Assign to Me",
          icon: "User",
          action: {
            type: "event",
            event: "custom:assign-task",
          },
        },
      ],
      eventTriggers: [
        {
          on: "property:changed",
          condition: {
            property: "priority",
            operator: "equals",
            value: "high",
          },
          action: "emit",
          event: "custom:high-priority-task",
        },
      ],
    } as CustomNodeJSON;

    CustomNodeFactory.registerFromConfig(nodeConfig);
  }, []);

  return <WorkflowBuilder />;
}

/**
 * Example 8: Node with event hooks
 */
export function Example8_NodeWithEventHooks() {
  React.useEffect(() => {
    (async () => {
      const nodeConfig = {
        id: "trackedTask",
        extends: "task" as const,
        name: "Tracked Task",
        description: "Task with lifecycle event tracking",
        hooks: {
          onCreated: "custom:task:created",
          onUpdated: "custom:task:updated",
          onDeleted: "custom:task:deleted",
          onPropertyChanged: "custom:task:property-changed",
        },
      } as CustomNodeJSON;

      // Register the node
      CustomNodeFactory.registerFromConfig(nodeConfig);

      // Subscribe to custom events
      const { globalEventBus } = await import("../core/events/EventBus");

      const unsubscribeCreated = globalEventBus.on(
        "custom:task:created",
        (event: any) => {
          console.log("Task created:", event.payload);
        }
      );

      const unsubscribeUpdated = globalEventBus.on(
        "custom:task:updated",
        (event: any) => {
          console.log("Task updated:", event.payload);
        }
      );

      return () => {
        unsubscribeCreated.unsubscribe();
        unsubscribeUpdated.unsubscribe();
      };
    })();
  }, []);

  return <WorkflowBuilder />;
}

/**
 * Example 9: Validate JSON before loading
 */
export function Example9_ValidateJSON() {
  const [validationResult, setValidationResult] = React.useState<any>(null);

  const handleLoadConfig = () => {
    const nodeConfig = {
      id: "testNode",
      extends: "task" as const,
      name: "Test Node",
      // ... config
    } as CustomNodeJSON;

    // Validate first
    const validation = CustomNodeFactory.validateConfig(nodeConfig);

    setValidationResult(validation);

    if (validation.valid) {
      CustomNodeFactory.registerFromConfig(nodeConfig);
      console.log("Node registered successfully");
    } else {
      console.error("Validation errors:", validation.errors);
    }
  };

  return (
    <div>
      <button onClick={handleLoadConfig}>Load & Validate Config</button>
      {validationResult && (
        <div>
          <p>Valid: {validationResult.valid ? "Yes" : "No"}</p>
          {!validationResult.valid && (
            <ul>
              {validationResult.errors.map((error: string, i: number) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <WorkflowBuilder />
    </div>
  );
}
