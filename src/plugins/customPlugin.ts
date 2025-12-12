/**
 * Custom Plugin Example
 * Demo plugin showing how to register custom components and categories
 */

import type { Plugin } from "@/core/plugins/PluginManager";
import type { BaseNodeConfig, NodeVisualConfig } from "@/core/types/base.types";
import { CategoryType } from "@/enum/workflow.enum";

import AICategoryIcon from "./icon/ai.svg";
import DataCategoryIcon from "./icon/data.svg";
import IntegrationCategoryIcon from "./icon/intergration.svg";

// Custom node types
export enum CustomNodeType {
  AI_ASSISTANT = "aiAssistant",
  DATA_PROCESSOR = "dataProcessor",
  API_INTEGRATOR = "apiIntegrator",
  CUSTOM_VALIDATOR = "customValidator",
}

// Custom category types
export enum CustomCategoryType {
  AI_ML = "ai_ml",
  DATA_PROCESSING = "data_processing",
  INTEGRATIONS = "integrations",
}

/**
 * Visual configurations for custom nodes using color palettes
 */
const aiAssistantVisualConfig: NodeVisualConfig = {
  backgroundColor: "#faf5ff",
  borderColor: "#a855f7",
  borderStyle: "solid",
  borderWidth: 2,
  ringColor: "rgba(168, 85, 247, 0.25)",
  textColor: "#581c87",
  descriptionColor: "#9333ea",
  iconBackgroundColor: "#f3e8ff",
  iconColor: "#9333ea",
};

const dataProcessorVisualConfig: NodeVisualConfig = {
  backgroundColor: "#eff6ff",
  borderColor: "#3b82f6",
  borderStyle: "dashed",
  borderWidth: 2,
  ringColor: "rgba(59, 130, 246, 0.25)",
  textColor: "#1e3a8a",
  descriptionColor: "#2563eb",
  iconBackgroundColor: "#dbeafe",
  iconColor: "#2563eb",
};

const apiIntegratorVisualConfig: NodeVisualConfig = {
  backgroundColor: "#f0fdf4",
  borderColor: "#22c55e",
  borderStyle: "solid",
  borderWidth: 2,
  ringColor: "rgba(34, 197, 94, 0.25)",
  textColor: "#14532d",
  descriptionColor: "#16a34a",
  iconBackgroundColor: "#dcfce7",
  iconColor: "#16a34a",
};

const customValidatorVisualConfig: NodeVisualConfig = {
  backgroundColor: "#fff7ed",
  borderColor: "#f97316",
  borderStyle: "dotted",
  borderWidth: 2,
  ringColor: "rgba(249, 115, 22, 0.25)",
  textColor: "#7c2d12",
  descriptionColor: "#ea580c",
  iconBackgroundColor: "#ffedd5",
  iconColor: "#ea580c",
};

// Helper function to create custom node config
const createCustomNodeConfig = (
  nodeType: CustomNodeType,
  category: CategoryType,
  visualConfig: NodeVisualConfig,
  metadata: {
    title: string;
    description?: string;
  }
): BaseNodeConfig => ({
  id: "",
  type: nodeType,
  position: { x: 0, y: 0 },
  data: {
    visualConfig, // Include visual config in data
  },
  nodeType: nodeType as any,
  category: category,
  visualConfig, // Also set at node config level
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
      validate: (_source, _target) => {
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
    author: "BPM Team",
  },

  config: {
    // Define custom categories
    categories: [
      {
        id: "category-ai-ml",
        type: CustomCategoryType.AI_ML,
        name: "AI & ML",
        config: {
          id: "category-ai-ml",
          name: "AI & Machine Learning",
          categoryType: CustomCategoryType.AI_ML,
          isOpen: true,
          icon: AICategoryIcon,
          description: "AI and Machine Learning nodes",
          order: 10,
        },
      },
      {
        id: "category-data-processing",
        type: CustomCategoryType.DATA_PROCESSING,
        name: "Data Processing",
        config: {
          id: "category-data-processing",
          name: "Data Processing",
          categoryType: CustomCategoryType.DATA_PROCESSING,
          isOpen: true,
          icon: DataCategoryIcon,
          description: "Data processing and transformation nodes",
          order: 20,
        },
      },
      {
        id: "category-integrations",
        type: CustomCategoryType.INTEGRATIONS,
        name: "Integrations",
        config: {
          id: "category-integrations",
          name: "Integrations",
          categoryType: CustomCategoryType.INTEGRATIONS,
          isOpen: true,
          icon: IntegrationCategoryIcon,
          description: "External system integration nodes",
          order: 30,
        },
      },
    ],

    nodes: [
      {
        id: CustomNodeType.AI_ASSISTANT,
        type: CustomNodeType.AI_ASSISTANT,
        name: "AI Assistant",
        config: {
          ...createCustomNodeConfig(
            CustomNodeType.AI_ASSISTANT,
            CustomCategoryType.AI_ML as any,
            aiAssistantVisualConfig,
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
            CustomCategoryType.DATA_PROCESSING as any,
            dataProcessorVisualConfig,
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
              validate: (source, _target) => {
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
            CustomCategoryType.INTEGRATIONS as any,
            apiIntegratorVisualConfig,
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
          CustomCategoryType.DATA_PROCESSING as any,
          customValidatorVisualConfig,
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
          action: async (_context: any) => {
            console.warn("API Integrator missing endpoint configuration");
          },
        },
      },
      {
        id: "workflow-cycle-detection",
        type: "validation",
        name: "Cycle Detection",
        config: {
          id: "workflow-cycle-detection",
          name: "Workflow Cycle Detection",
          description: "Prevent circular loops in workflow",
          type: "validation",
          enabled: true,
          priority: 100, // High priority - chạy đầu tiên
          scope: "workflow",
          condition: (context: any) => {
            const { nodes, edges } = context;
            if (!nodes || !edges) return true;

            // Tạo adjacency list để dễ dàng traverse
            const graph = new Map<string, string[]>();
            nodes.forEach((node: any) => {
              graph.set(node.id, []);
            });

            edges.forEach((edge: any) => {
              const neighbors = graph.get(edge.source) || [];
              neighbors.push(edge.target);
              graph.set(edge.source, neighbors);
            });

            // DFS để phát hiện cycle
            const visited = new Set<string>();
            const recStack = new Set<string>();

            const hasCycle = (nodeId: string): boolean => {
              if (!visited.has(nodeId)) {
                visited.add(nodeId);
                recStack.add(nodeId);

                const neighbors = graph.get(nodeId) || [];
                for (const neighbor of neighbors) {
                  if (!visited.has(neighbor) && hasCycle(neighbor)) {
                    return true;
                  } else if (recStack.has(neighbor)) {
                    // Phát hiện cycle
                    return true;
                  }
                }
              }
              recStack.delete(nodeId);
              return false;
            };

            // Kiểm tra từ tất cả các nodes
            for (const nodeId of graph.keys()) {
              if (hasCycle(nodeId)) {
                return false; // Có cycle - validation fail
              }
            }

            return true; // Không có cycle - validation pass
          },
          action: async (_context: any) => {
            console.error("❌ Workflow contains circular loop - not allowed!");
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
