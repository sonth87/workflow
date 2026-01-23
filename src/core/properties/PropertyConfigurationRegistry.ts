/**
 * Property Configuration Registry
 * Central registry để quản lý property configurations cho node và edge types
 */

import type {
  NodePropertyConfiguration,
  EdgePropertyConfiguration,
  PropertyGroupDefinition,
  PropertyFieldDefinition,
} from "./types/propertyDefinition";

/**
 * Singleton registry để quản lý property configurations
 */
class PropertyConfigurationRegistry {
  private static instance: PropertyConfigurationRegistry;

  private nodeConfigs: Map<string, NodePropertyConfiguration> = new Map();
  private edgeConfigs: Map<string, EdgePropertyConfiguration> = new Map();

  // Base configurations (áp dụng cho tất cả nodes/edges)
  private baseNodeGroups: PropertyGroupDefinition[] = [];
  private baseEdgeGroups: PropertyGroupDefinition[] = [];

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): PropertyConfigurationRegistry {
    if (!PropertyConfigurationRegistry.instance) {
      PropertyConfigurationRegistry.instance =
        new PropertyConfigurationRegistry();
    }
    return PropertyConfigurationRegistry.instance;
  }

  /**
   * Register configuration cho một node type
   */
  registerNodeConfig(config: NodePropertyConfiguration): void {
    this.nodeConfigs.set(config.nodeType, config);
  }

  /**
   * Register configuration cho một edge type
   */
  registerEdgeConfig(config: EdgePropertyConfiguration): void {
    this.edgeConfigs.set(config.edgeType, config);
  }

  /**
   * Batch register nhiều node configs
   */
  registerNodeConfigs(configs: NodePropertyConfiguration[]): void {
    configs.forEach(config => this.registerNodeConfig(config));
  }

  /**
   * Unregister configuration cho một node type
   */
  unregisterNodeConfig(nodeType: string): boolean {
    return this.nodeConfigs.delete(nodeType);
  }

  /**
   * Unregister configuration cho một edge type
   */
  unregisterEdgeConfig(edgeType: string): boolean {
    return this.edgeConfigs.delete(edgeType);
  }

  /**
   * Set base property groups cho tất cả nodes
   */
  setBaseNodeGroups(groups: PropertyGroupDefinition[]): void {
    this.baseNodeGroups = groups;
  }

  /**
   * Set base property groups cho tất cả edges
   */
  setBaseEdgeGroups(groups: PropertyGroupDefinition[]): void {
    this.baseEdgeGroups = groups;
  }

  /**
   * Get property groups cho một node type
   * Merge base groups với custom groups
   */
  getNodePropertyGroups(nodeType: string): PropertyGroupDefinition[] {
    const config = this.nodeConfigs.get(nodeType);
    const customGroups = config?.propertyGroups || [];

    return this.mergePropertyGroups(this.baseNodeGroups, customGroups);
  }

  /**
   * Get property groups cho một edge type
   * Merge base groups với custom groups
   */
  getEdgePropertyGroups(edgeType: string): PropertyGroupDefinition[] {
    const config = this.edgeConfigs.get(edgeType);
    const customGroups = config?.propertyGroups || [];

    return this.mergePropertyGroups(this.baseEdgeGroups, customGroups);
  }

  /**
   * Check xem node type có được register chưa
   */
  hasNodeConfig(nodeType: string): boolean {
    return this.nodeConfigs.has(nodeType);
  }

  /**
   * Check xem edge type có được register chưa
   */
  hasEdgeConfig(edgeType: string): boolean {
    return this.edgeConfigs.has(edgeType);
  }

  /**
   * Get tất cả registered node types
   */
  getRegisteredNodeTypes(): string[] {
    return Array.from(this.nodeConfigs.keys());
  }

  /**
   * Get tất cả registered edge types
   */
  getRegisteredEdgeTypes(): string[] {
    return Array.from(this.edgeConfigs.keys());
  }

  /**
   * Get default properties cho một node type
   */
  getDefaultNodeProperties(nodeType: string): Record<string, any> {
    const groups = this.getNodePropertyGroups(nodeType);
    const defaults: Record<string, any> = {};
    groups.forEach(group => {
      group.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue;
        }
      });
    });
    return defaults;
  }

  /**
   * Get default properties cho một edge type
   */
  getDefaultEdgeProperties(edgeType: string): Record<string, any> {
    const groups = this.getEdgePropertyGroups(edgeType);
    const defaults: Record<string, any> = {};
    groups.forEach(group => {
      group.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue;
        }
      });
    });
    return defaults;
  }

  /**
   * Clear toàn bộ registry (useful cho testing)
   */
  clear(): void {
    this.nodeConfigs.clear();
    this.edgeConfigs.clear();
    this.baseNodeGroups = [];
    this.baseEdgeGroups = [];
  }

  /**
   * Merge base groups với custom groups
   * Logic:
   * 1. Nếu custom group có cùng ID với base group, merge fields
   * 2. Nếu không, giữ nguyên cả base và custom groups
   * 3. Sort theo order
   */
  private mergePropertyGroups(
    baseGroups: PropertyGroupDefinition[],
    customGroups: PropertyGroupDefinition[]
  ): PropertyGroupDefinition[] {
    const mergedMap = new Map<string, PropertyGroupDefinition>();

    // Add base groups
    baseGroups.forEach(group => {
      mergedMap.set(group.id, { ...group });
    });

    // Merge hoặc add custom groups
    customGroups.forEach(customGroup => {
      const existingGroup = mergedMap.get(customGroup.id);

      if (existingGroup) {
        // Merge fields nếu group đã tồn tại
        mergedMap.set(customGroup.id, {
          ...existingGroup,
          ...customGroup,
          fields: this.mergeFields(existingGroup.fields, customGroup.fields),
        });
      } else {
        // Add group mới
        mergedMap.set(customGroup.id, { ...customGroup });
      }
    });

    // Convert to array và sort theo order
    return Array.from(mergedMap.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Merge fields từ base và custom
   * Custom fields sẽ override base fields nếu có cùng ID
   */
  private mergeFields(
    baseFields: PropertyFieldDefinition[],
    customFields: PropertyFieldDefinition[]
  ): PropertyFieldDefinition[] {
    const mergedMap = new Map<string, PropertyFieldDefinition>();

    // Add base fields
    baseFields.forEach(field => {
      mergedMap.set(field.id, { ...field });
    });

    // Override với custom fields
    customFields.forEach(field => {
      mergedMap.set(field.id, { ...field });
    });

    // Convert to array và sort theo order (nếu có)
    return Array.from(mergedMap.values()).sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }
}

/**
 * Export singleton instance
 */
export const propertyRegistry = PropertyConfigurationRegistry.getInstance();

/**
 * Export class để có thể tạo instance mới (cho testing)
 */
export { PropertyConfigurationRegistry };
