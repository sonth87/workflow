import {
  BaseNodeType,
  getBaseNodeDefinition,
} from "@/core/nodes/BaseNodeDefinitions";
import { NodeType, CategoryType } from "@/enum/workflow.enum";
import type { BaseNodeConfig } from "@/core/types/base.types";

/**
 * Helper to get visual config from base node type
 */
export const getBaseVisualConfig = (baseType: BaseNodeType) => {
  const baseDef = getBaseNodeDefinition(baseType);
  return baseDef?.visualConfig;
};

export const createDefaultNodeConfig = (
  nodeType: NodeType,
  category: CategoryType,
  metadata: Partial<BaseNodeConfig["metadata"]>,
  baseType?: BaseNodeType
): BaseNodeConfig => ({
  id: "",
  type: nodeType,
  position: { x: 0, y: 0 },
  data: {},
  nodeType,
  category: category,
  metadata: {
    id: nodeType,
    title: metadata.title || nodeType,
    description: metadata.description,
    version: "1.0.0",
  },
  visualConfig: baseType ? getBaseVisualConfig(baseType) : undefined,
  collapsible: true,
  collapsed: false,
  editable: true,
  deletable: true,
  connectable: true,
  draggable: true,
  propertyDefinitions: [],
  properties: {},
});
