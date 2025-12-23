/**
 * Initialize Property System
 * Register base property groups vào registry
 * File này phải được import ở entry point của app (main.tsx hoặc App.tsx)
 */

import {
  propertyRegistry,
  baseNodePropertyGroups,
  baseEdgePropertyGroups,
} from "@/core/properties";

/**
 * Initialize property system với base configurations
 * Gọi function này trong main.tsx hoặc App.tsx
 */
export function initializePropertySystem() {
  // Register base property groups
  propertyRegistry.setBaseNodeGroups(baseNodePropertyGroups);
  propertyRegistry.setBaseEdgeGroups(baseEdgePropertyGroups);

  console.log("[Property System] Initialized with base property groups");
}

// Export registry để có thể register custom configurations
export { propertyRegistry };
