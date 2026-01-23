/**
 * Workflow Transformer
 * Layer để xử lý việc transform dữ liệu in/out cho import/export
 * Giảm thiểu dữ liệu dư thừa, loại bỏ các config đã có trong registry
 */

import type { BaseNodeConfig, BaseEdgeConfig } from "../types/base.types";
import { nodeRegistry } from "../registry/NodeRegistry";
import { edgeRegistry } from "../registry/EdgeRegistry";
import { translationRegistry } from "../registry/TranslationRegistry";
import { propertyRegistry } from "../properties";

export interface MinimalWorkflowData {
  nodes: Partial<BaseNodeConfig>[];
  edges: Partial<BaseEdgeConfig>[];
  metadata?: Record<string, unknown>;
}

export class WorkflowTransformer {
  /**
   * Transform workflow sang dạng tối thiểu để export
   */
  static exportMinimal(
    nodes: BaseNodeConfig[],
    edges: BaseEdgeConfig[],
    language: string = "vi"
  ): MinimalWorkflowData {
    return {
      nodes: nodes.map(node => this.transformNodeForExport(node, language)),
      edges: edges.map(edge => this.transformEdgeForExport(edge, language)),
    };
  }

  /**
   * Transform node sang dạng tối thiểu
   */
  private static transformNodeForExport(
    node: BaseNodeConfig,
    language: string
  ): Partial<BaseNodeConfig> {
    const nodeType = (node.nodeType || node.type) as string;
    const defaultProps = propertyRegistry.getDefaultNodeProperties(nodeType);

    // 1. Chỉ giữ lại các thông tin instance-specific
    const minimalNode: any = {
      id: node.id,
      type: node.type,
      nodeType: node.nodeType,
      position: node.position,
      properties: {},
    };

    // 2. Chỉ export các properties khác với default hoặc là label
    if (node.properties) {
      Object.entries(node.properties).forEach(([key, value]) => {
        if (key === "label") {
          // Luôn giữ label và translate nó
          minimalNode.properties.label =
            typeof value === "string"
              ? translationRegistry.translate(value, language)
              : value;
        } else if (JSON.stringify(value) !== JSON.stringify(defaultProps[key])) {
          minimalNode.properties[key] = value;
        }
      });
    }

    if (node.parentId) minimalNode.parentId = node.parentId;
    if (node.extent) minimalNode.extent = node.extent;
    if (node.width) minimalNode.width = node.width;
    if (node.height) minimalNode.height = node.height;

    // 3. Xử lý data - chỉ giữ lại label nếu nó khác registry title
    const registryItem = nodeRegistry.get(nodeType);
    const registryTitle = registryItem?.config?.metadata?.title;
    const currentLabel = node.data?.label;

    if (currentLabel && currentLabel !== registryTitle) {
      minimalNode.data = {
        label:
          typeof currentLabel === "string"
            ? translationRegistry.translate(currentLabel, language)
            : currentLabel,
      };
    }

    return minimalNode;
  }

  /**
   * Transform edge sang dạng tối thiểu
   */
  private static transformEdgeForExport(
    edge: BaseEdgeConfig,
    language: string
  ): Partial<BaseEdgeConfig> {
    const edgeType = edge.type || "default";
    const defaultProps = propertyRegistry.getDefaultEdgeProperties(edgeType);

    const minimalEdge: any = {
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
    };

    if (edge.sourceHandle) minimalEdge.sourceHandle = edge.sourceHandle;
    if (edge.targetHandle) minimalEdge.targetHandle = edge.targetHandle;

    // Properties
    if (edge.properties) {
      const edgeProps: any = {};
      let hasCustomProps = false;
      Object.entries(edge.properties).forEach(([key, value]) => {
        if (JSON.stringify(value) !== JSON.stringify(defaultProps[key])) {
          edgeProps[key] = value;
          hasCustomProps = true;
        }
      });
      if (hasCustomProps) minimalEdge.properties = edgeProps;
    }

    // Chỉ giữ lại condition nếu có
    if (edge.condition) minimalEdge.condition = edge.condition;

    // Giữ lại pathType nếu khác mặc định
    if (edge.pathType && edge.pathType !== "default" && edge.pathType !== "bezier") {
      minimalEdge.pathType = edge.pathType;
    }

    return minimalEdge;
  }

  /**
   * Transform dữ liệu khi import (hydrating with registry data)
   */
  static importFull(data: MinimalWorkflowData): {
    nodes: BaseNodeConfig[];
    edges: BaseEdgeConfig[];
  } {
    const nodes = (data.nodes || []).map(minimalNode => {
      const nodeType = (minimalNode.nodeType || minimalNode.type) as string;
      const baseNode = nodeRegistry.createNode(nodeType, minimalNode as any);

      if (!baseNode) {
        // Fallback nếu không tìm thấy type
        return minimalNode as BaseNodeConfig;
      }

      return baseNode;
    });

    const edges = (data.edges || []).map(minimalEdge => {
      const edgeType = minimalEdge.type || "default";
      const baseEdge = edgeRegistry.get(edgeType);

      return {
        ...(baseEdge?.config || {}),
        ...minimalEdge,
        data: {
          ...(baseEdge?.config?.data || {}),
          ...minimalEdge.data,
        },
      } as BaseEdgeConfig;
    });

    return { nodes, edges };
  }
}
