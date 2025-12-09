/**
 * Custom Plugin Example
 * Demo plugin showing how to register custom components and categories
 */

import type { Plugin } from "@/core/plugins/PluginManager";
import type { BaseNodeConfig, BaseRuleConfig } from "@/core/types/base.types";
import { CategoryType } from "@/enum/workflow.enum";

// Custom node types
export enum CustomNodeType {
  AI_ASSISTANT = "aiAssistant",
  DATA_PROCESSOR = "dataProcessor",
  API_INTEGRATOR = "apiIntegrator",
  CUSTOM_VALIDATOR = "customValidator",
}

// Helper function to create custom node config
const createCustomNodeConfig = (
  nodeType: CustomNodeType,
  category: CategoryType,
  metadata: {
    title: string;
    description?: string;
  }
): BaseNodeConfig => ({
  id: "",
  type: nodeType,
  position: { x: 0, y: 0 },
  data: {},
  nodeType: nodeType as any,
  category: category,
  metadata: {
    id: nodeType,
    title: metadata.title,
    description: metadata.description,
    version: "1.0.0",
  },
  collapsible: true,
  collapsed: false,
  editable: true,
  deletable: true,
  connectable: true,
  draggable: true,
  propertyDefinitions: [
    {
      id: "customProperty",
      name: "customProperty",
      label: "Custom Property",
      type: "text",
      required: false,
      defaultValue: "",
      order: 0,
      group: "basic",
    },
  ],
  properties: {
    customProperty: "",
  },
  // Thêm validation rules cho node
  validationRules: [
    {
      id: `${nodeType}-required-name`,
      type: "required",
      message: "Node name is required",
      validator: (value: any) => {
        return !!value?.metadata?.title;
      },
    },
  ],
  // Thêm connection rules cho node
  connectionRules: [
    {
      id: `${nodeType}-max-connections`,
      name: "Max Connections",
      description: "Maximum 5 connections per node",
      maxInputConnections: 5,
      maxOutputConnections: 5,
      validate: (source, target) => {
        // Custom validation logic
        return { valid: true };
      },
    },
  ],
});

/**
 * Custom Plugin
 */
export const customPlugin: Plugin = {
  metadata: {
    id: "custom-plugin",
    name: "Custom Plugin",
    version: "1.0.0",
    description: "Demo plugin with custom components and category",
    author: "Demo Team",
  },

  config: {
    nodes: [
      {
        id: CustomNodeType.AI_ASSISTANT,
        type: CustomNodeType.AI_ASSISTANT,
        name: "AI Assistant",
        config: {
          ...createCustomNodeConfig(
            CustomNodeType.AI_ASSISTANT,
            CategoryType.CUSTOM,
            {
              title: "AI Assistant",
              description: "AI-powered task automation",
            }
          ),
          // Override với specific rules cho AI Assistant
          propertyDefinitions: [
            {
              id: "modelName",
              name: "modelName",
              label: "AI Model Name",
              type: "select",
              required: true,
              defaultValue: "gpt-4",
              order: 0,
              group: "config",
              options: [
                { label: "GPT-4", value: "gpt-4" },
                { label: "GPT-3.5", value: "gpt-3.5" },
                { label: "Claude", value: "claude" },
              ],
            },
            {
              id: "prompt",
              name: "prompt",
              label: "Prompt",
              type: "textarea",
              required: true,
              defaultValue: "",
              order: 1,
              group: "config",
            },
          ],
          validationRules: [
            {
              id: "ai-model-required",
              type: "required",
              message: "AI Model is required",
              validator: (value: any) => !!value?.properties?.modelName,
            },
            {
              id: "prompt-required",
              type: "required",
              message: "Prompt is required",
              validator: (value: any) => !!value?.properties?.prompt,
            },
          ],
        },
      },
      {
        id: CustomNodeType.DATA_PROCESSOR,
        type: CustomNodeType.DATA_PROCESSOR,
        name: "Data Processor",
        config: {
          ...createCustomNodeConfig(
            CustomNodeType.DATA_PROCESSOR,
            CategoryType.CUSTOM,
            {
              title: "Data Processor",
              description: "Process and transform data",
            }
          ),
          propertyDefinitions: [
            {
              id: "processingType",
              name: "processingType",
              label: "Processing Type",
              type: "select",
              required: true,
              defaultValue: "transform",
              order: 0,
              group: "config",
              options: [
                { label: "Transform", value: "transform" },
                { label: "Filter", value: "filter" },
                { label: "Aggregate", value: "aggregate" },
              ],
            },
          ],
          connectionRules: [
            {
              id: "data-processor-input",
              name: "Data Input Rule",
              description: "Must have at least one input",
              maxInputConnections: 10,
              maxOutputConnections: 5,
              validate: (source, target) => {
                // Data processor phải nhận input từ data sources
                const validSources = [
                  CustomNodeType.API_INTEGRATOR,
                  CustomNodeType.DATA_PROCESSOR,
                ];
                if (validSources.includes(source.type as CustomNodeType)) {
                  return { valid: true };
                }
                return {
                  valid: false,
                  message: "Data Processor must connect from valid data source",
                };
              },
            },
          ],
        },
      },
      {
        id: CustomNodeType.API_INTEGRATOR,
        type: CustomNodeType.API_INTEGRATOR,
        name: "API Integrator",
        config: {
          ...createCustomNodeConfig(
            CustomNodeType.API_INTEGRATOR,
            CategoryType.CUSTOM,
            {
              title: "API Integrator",
              description: "Integrate with external APIs",
            }
          ),
          propertyDefinitions: [
            {
              id: "apiEndpoint",
              name: "apiEndpoint",
              label: "API Endpoint",
              type: "text",
              required: true,
              defaultValue: "",
              order: 0,
              group: "config",
            },
            {
              id: "method",
              name: "method",
              label: "HTTP Method",
              type: "select",
              required: true,
              defaultValue: "GET",
              order: 1,
              group: "config",
              options: [
                { label: "GET", value: "GET" },
                { label: "POST", value: "POST" },
                { label: "PUT", value: "PUT" },
                { label: "DELETE", value: "DELETE" },
              ],
            },
          ],
          validationRules: [
            {
              id: "api-endpoint-valid",
              type: "pattern",
              message: "Invalid API endpoint URL",
              value: /^https?:\/\/.+/,
              validator: (value: any) => {
                const endpoint = value?.properties?.apiEndpoint;
                return !endpoint || /^https?:\/\/.+/.test(endpoint);
              },
            },
          ],
        },
      },
      {
        id: CustomNodeType.CUSTOM_VALIDATOR,
        type: CustomNodeType.CUSTOM_VALIDATOR,
        name: "Custom Validator",
        config: createCustomNodeConfig(
          CustomNodeType.CUSTOM_VALIDATOR,
          CategoryType.CUSTOM,
          {
            title: "Custom Validator",
            description: "Custom validation logic",
          }
        ),
      },
    ],

    // Thêm custom rules
    rules: [
      {
        id: "ai-assistant-validation",
        type: "validation",
        name: "AI Assistant Validation",
        config: {
          id: "ai-assistant-validation",
          name: "AI Assistant Validation",
          description: "Validate AI Assistant node configuration",
          type: "validation",
          enabled: true,
          priority: 10,
          scope: "node",
          condition: (context: any) => {
            const { node } = context;
            // Chỉ áp dụng cho AI Assistant node
            if (node?.type !== CustomNodeType.AI_ASSISTANT) {
              return true;
            }
            // Kiểm tra custom property
            return !!node.properties?.customProperty;
          },
        },
      },
      {
        id: "custom-node-connection-limit",
        type: "connection",
        name: "Custom Node Connection Limit",
        config: {
          id: "custom-node-connection-limit",
          name: "Custom Node Connection Limit",
          description: "Limit connections for custom nodes",
          type: "connection",
          enabled: true,
          priority: 20,
          scope: "node",
          condition: (context: any) => {
            const { node, edges } = context;
            // Custom nodes không được có quá 3 connections
            const customNodeTypes = [
              CustomNodeType.AI_ASSISTANT,
              CustomNodeType.DATA_PROCESSOR,
              CustomNodeType.API_INTEGRATOR,
            ];
            if (!customNodeTypes.includes(node?.type)) {
              return true;
            }
            const nodeConnections = edges?.filter(
              (e: any) => e.source === node.id || e.target === node.id
            );
            return (nodeConnections?.length || 0) <= 3;
          },
        },
      },
      {
        id: "api-integrator-required-config",
        type: "validation",
        name: "API Integrator Required Config",
        config: {
          id: "api-integrator-required-config",
          name: "API Integrator Required Config",
          description: "API Integrator must have endpoint configured",
          type: "validation",
          enabled: true,
          priority: 15,
          scope: "node",
          condition: (context: any) => {
            const { node } = context;
            if (node?.type !== CustomNodeType.API_INTEGRATOR) {
              return true;
            }
            // Kiểm tra có endpoint configuration
            return !!node.properties?.apiEndpoint;
          },
          action: async (context: any) => {
            console.warn("API Integrator missing endpoint configuration");
          },
        },
      },
    ],
  },

  // Lifecycle hooks
  onInstall: async () => {
    console.log("🔧 Custom Plugin: Installing...");
  },

  onUninstall: async () => {
    console.log("🔧 Custom Plugin: Uninstalling...");
  },

  onActivate: async () => {
    console.log("✅ Custom Plugin: Activated");
  },

  onDeactivate: async () => {
    console.log("⏸️ Custom Plugin: Deactivated");
  },

  initialize: async () => {
    console.log("🚀 Custom Plugin: Initialized with custom nodes");
    console.log("   - AI Assistant");
    console.log("   - Data Processor");
    console.log("   - API Integrator");
    console.log("   - Custom Validator");
  },
};
