/**
 * Core Properties Module
 * Export all property-related functionality
 */

// Registry
export {
  PropertyConfigurationRegistry,
  propertyRegistry,
} from "./PropertyConfigurationRegistry";

// Sync Engine
export { PropertySyncEngine, propertySyncEngine } from "./PropertySyncEngine";
export type { PropertySyncResult } from "./PropertySyncEngine";

// Base Property Groups
export {
  baseNodePropertyGroups,
  baseEdgePropertyGroups,
} from "./basePropertyGroups";

// Initialization
export { initializePropertySystem } from "./init";

// Types
export type {
  PropertyFieldType,
  PropertyEntity,
  PropertyCondition,
  FieldOption,
  FieldOptions,
  PropertyRenderer,
  ValidationError,
  ValidationWarning,
  PropertyFieldDefinition,
  PropertyGroupDefinition,
  NodePropertyConfiguration,
  EdgePropertyConfiguration,
  ConditionResult,
  PropertyFieldContext,
} from "./types/propertyDefinition";

export type {
  FieldValidationResult,
  EntityValidationResult,
  ValidationContext,
  CustomValidator,
  ValidationOptions,
} from "./types/validationTypes";
