/**
 * Advanced Plugin Example
 * Ví dụ plugin với nhiều tính năng nâng cao:
 * - Custom edges
 * - Custom validation rules
 * - Plugin dependencies
 * - Event subscriptions
 */

import type { Plugin } from "@/core/plugins/PluginManager";
import type { BaseNodeConfig, BaseRuleConfig } from "@/core/types/base.types";
import { CategoryType } from "@/enum/workflow.enum";
import { globalEventBus, WorkflowEventTypes } from "@/core/events/EventBus";

// Import plugin translations
import pluginTranslationsEn from "@/translations/plugins.en.json";
import pluginTranslationsVi from "@/translations/plugins.vi.json";

// Custom node types cho AI/ML workflows
export enum AINodeType {
  ML_TRAINING = "mlTraining",
  ML_PREDICTION = "mlPrediction",
  DATA_PREPROCESSING = "dataPreprocessing",
  MODEL_EVALUATION = "modelEvaluation",
}

// Helper function
const createAINodeConfig = (
  nodeType: AINodeType,
  metadata: { title: string; description?: string }
): BaseNodeConfig => ({
  id: "",
  type: nodeType,
  position: { x: 0, y: 0 },
  data: {},
  nodeType: nodeType as any,
  category: CategoryType.CUSTOM,
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
      id: "modelType",
      name: "modelType",
      label: "plugin.aiml.property.modelType.label",
      type: "select",
      required: true,
      defaultValue: "classification",
      options: [
        {
          label: "plugin.aiml.property.modelType.option.classification",
          value: "classification",
        },
        {
          label: "plugin.aiml.property.modelType.option.regression",
          value: "regression",
        },
        {
          label: "plugin.aiml.property.modelType.option.clustering",
          value: "clustering",
        },
      ],
      order: 0,
      group: "model",
    },
    {
      id: "algorithm",
      name: "algorithm",
      label: "plugin.aiml.property.algorithm.label",
      type: "select",
      required: true,
      defaultValue: "random_forest",
      options: [
        {
          label: "plugin.aiml.property.algorithm.option.randomForest",
          value: "random_forest",
        },
        {
          label: "plugin.aiml.property.algorithm.option.neuralNetwork",
          value: "neural_network",
        },
        { label: "plugin.aiml.property.algorithm.option.svm", value: "svm" },
      ],
      order: 1,
      group: "model",
    },
    {
      id: "datasetPath",
      name: "datasetPath",
      label: "plugin.aiml.property.datasetPath.label",
      type: "text",
      required: true,
      defaultValue: "",
      order: 2,
      group: "data",
    },
  ],
  properties: {
    modelType: "classification",
    algorithm: "random_forest",
    datasetPath: "",
  },
});

// Custom validation rules
const aiWorkflowRules: Array<{
  id: string;
  type: string;
  name: string;
  config: BaseRuleConfig;
}> = [
  {
    id: "ml-workflow-validation",
    type: "custom",
    name: "ML Workflow Validation",
    config: {
      id: "ml-workflow-validation",
      type: "custom",
      name: "ml-workflow-validation",
      enabled: true,
      metadata: {
        id: "ml-workflow-validation",
        title: "ML Workflow Validation",
        description: "Validate ML workflow structure",
        version: "1.0.0",
      },
      validate: async (context: any) => {
        const { nodes } = context;
        const errors: string[] = [];

        // Rule: ML Training must come before ML Prediction
        const trainingNodes = nodes.filter(
          (n: any) => n.type === AINodeType.ML_TRAINING
        );
        const predictionNodes = nodes.filter(
          (n: any) => n.type === AINodeType.ML_PREDICTION
        );

        if (predictionNodes.length > 0 && trainingNodes.length === 0) {
          errors.push(
            "ML Prediction requires at least one ML Training node in the workflow"
          );
        }

        return {
          valid: errors.length === 0,
          errors,
        };
      },
    },
  },
];

/**
 * AI/ML Plugin
 */
export const aiMLPlugin: Plugin = {
  metadata: {
    id: "ai-ml-plugin",
    name: "AI/ML Workflow Plugin",
    version: "1.0.0",
    description: "Plugin for building AI/ML workflows",
    author: "AI Team",
    dependencies: [], // No dependencies
  },

  config: {
    nodes: [
      {
        id: AINodeType.ML_TRAINING,
        type: AINodeType.ML_TRAINING,
        name: "ML Training",
        config: createAINodeConfig(AINodeType.ML_TRAINING, {
          title: "plugin.aiml.mlTraining.title",
          description: "plugin.aiml.mlTraining.description",
        }),
      },
      {
        id: AINodeType.ML_PREDICTION,
        type: AINodeType.ML_PREDICTION,
        name: "ML Prediction",
        config: createAINodeConfig(AINodeType.ML_PREDICTION, {
          title: "plugin.aiml.mlPrediction.title",
          description: "plugin.aiml.mlPrediction.description",
        }),
      },
      {
        id: AINodeType.DATA_PREPROCESSING,
        type: AINodeType.DATA_PREPROCESSING,
        name: "Data Preprocessing",
        config: createAINodeConfig(AINodeType.DATA_PREPROCESSING, {
          title: "plugin.aiml.dataPreprocessing.title",
          description: "plugin.aiml.dataPreprocessing.description",
        }),
      },
      {
        id: AINodeType.MODEL_EVALUATION,
        type: AINodeType.MODEL_EVALUATION,
        name: "Model Evaluation",
        config: createAINodeConfig(AINodeType.MODEL_EVALUATION, {
          title: "plugin.aiml.modelEvaluation.title",
          description: "plugin.aiml.modelEvaluation.description",
        }),
      },
    ],
    rules: aiWorkflowRules,
    translations: {
      en: pluginTranslationsEn as Record<string, string>,
      vi: pluginTranslationsVi as Record<string, string>,
    },
  },

  // Lifecycle hooks
  onInstall: async () => {
    console.log("🤖 AI/ML Plugin: Installing...");
  },

  onUninstall: async () => {
    console.log("🤖 AI/ML Plugin: Uninstalling...");
  },

  onActivate: async () => {
    console.log("✅ AI/ML Plugin: Activated");

    // Subscribe to workflow events
    globalEventBus.on(WorkflowEventTypes.NODE_ADDED, (event: any) => {
      if (
        event.nodeType === AINodeType.ML_TRAINING ||
        event.nodeType === AINodeType.ML_PREDICTION
      ) {
        console.log(`🤖 AI/ML Node created: ${event.nodeType}`);
      }
    });
  },

  onDeactivate: async () => {
    console.log("⏸️ AI/ML Plugin: Deactivated");

    // Cleanup event listeners
    // globalEventBus.off would need the handler reference
  },

  initialize: async () => {
    console.log("🚀 AI/ML Plugin: Initialized");
    console.log("   Available ML Nodes:");
    console.log("   - ML Training");
    console.log("   - ML Prediction");
    console.log("   - Data Preprocessing");
    console.log("   - Model Evaluation");
  },
};

/**
 * Usage Example:
 *
 * import { aiMLPlugin } from "./plugins/aiMLPlugin";
 * import { customPlugin } from "./plugins/customPlugin";
 *
 * <WorkflowBuilder
 *   pluginOptions={{
 *     plugins: [customPlugin, aiMLPlugin],
 *   }}
 * />
 */
