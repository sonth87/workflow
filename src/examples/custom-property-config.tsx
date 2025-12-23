/**
 * Example: Custom Node Property Configuration
 * Demonstrates how to register custom property groups for a node type
 */

import { propertyRegistry } from "@/core/properties/init";
import type { PropertyGroupDefinition } from "@/core/properties";
import { z } from "zod";
import { Settings, Zap, Database } from "lucide-react";

/**
 * Example 1: Simple Custom Node
 */
export const simpleNodePropertyGroups: PropertyGroupDefinition[] = [
  {
    id: "config",
    label: "Configuration",
    description: "Basic configuration options",
    icon: Settings,
    order: 10,
    fields: [
      {
        id: "apiEndpoint",
        label: "API Endpoint",
        type: "text",
        required: true,
        placeholder: "https://api.example.com",
        validation: z.string().url("Must be a valid URL"),
        helpText: "Enter the API endpoint URL",
        order: 1,
      },
      {
        id: "method",
        label: "HTTP Method",
        type: "select",
        defaultValue: "GET",
        options: {
          options: [
            { label: "GET", value: "GET" },
            { label: "POST", value: "POST" },
            { label: "PUT", value: "PUT" },
            { label: "DELETE", value: "DELETE" },
          ],
        },
        order: 2,
      },
      {
        id: "timeout",
        label: "Timeout (seconds)",
        type: "number",
        defaultValue: 30,
        options: {
          min: 1,
          max: 300,
        },
        validation: z.number().min(1).max(300),
        order: 3,
      },
    ],
  },
];

/**
 * Example 2: Advanced Node with Conditional Fields
 */
export const advancedNodePropertyGroups: PropertyGroupDefinition[] = [
  {
    id: "database",
    label: "Database",
    description: "Database connection settings",
    icon: Database,
    order: 10,
    fields: [
      {
        id: "dbType",
        label: "Database Type",
        type: "select",
        defaultValue: "postgres",
        options: {
          options: [
            { label: "PostgreSQL", value: "postgres" },
            { label: "MySQL", value: "mysql" },
            { label: "MongoDB", value: "mongodb" },
          ],
        },
        order: 1,
      },
      {
        id: "host",
        label: "Host",
        type: "text",
        required: true,
        defaultValue: "localhost",
        order: 2,
      },
      {
        id: "port",
        label: "Port",
        type: "number",
        defaultValue: 5432,
        // Conditional: show different default based on dbType
        visible: entity => entity.properties?.dbType !== undefined,
        order: 3,
      },
      {
        id: "ssl",
        label: "Use SSL",
        type: "boolean",
        defaultValue: false,
        order: 4,
      },
      {
        id: "sslCert",
        label: "SSL Certificate",
        type: "textarea",
        placeholder: "Paste SSL certificate here",
        // Only visible when SSL is enabled
        visible: {
          field: "ssl",
          operator: "equals",
          value: true,
        },
        order: 5,
      },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    description: "Performance tuning options",
    icon: Zap,
    order: 20,
    fields: [
      {
        id: "poolSize",
        label: "Connection Pool Size",
        type: "slider",
        defaultValue: 10,
        options: {
          min: 1,
          max: 100,
          step: 1,
        },
        helpText: "Number of concurrent database connections",
        order: 1,
      },
      {
        id: "cacheEnabled",
        label: "Enable Caching",
        type: "boolean",
        defaultValue: true,
        order: 2,
      },
      {
        id: "cacheTTL",
        label: "Cache TTL (seconds)",
        type: "number",
        defaultValue: 300,
        disabled: {
          field: "cacheEnabled",
          operator: "equals",
          value: false,
        },
        order: 3,
      },
    ],
  },
];

/**
 * Example 3: Custom Renderer
 */
export const customRendererExample: PropertyGroupDefinition = {
  id: "custom",
  label: "Custom",
  order: 30,
  fields: [
    {
      id: "schedule",
      label: "Schedule",
      type: "custom",
      customRenderer: ({ value, onChange, errors }) => {
        const scheduleValue = (value as { time: string; timezone: string }) || {
          time: "00:00",
          timezone: "UTC",
        };

        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Schedule Time</label>
            <div className="flex gap-2">
              <input
                type="time"
                value={scheduleValue.time}
                onChange={e =>
                  onChange({ ...scheduleValue, time: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <select
                value={scheduleValue.timezone}
                onChange={e =>
                  onChange({ ...scheduleValue, timezone: e.target.value })
                }
                className="px-3 py-2 border rounded-md"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">EST</option>
                <option value="America/Los_Angeles">PST</option>
                <option value="Asia/Tokyo">JST</option>
              </select>
            </div>
            {errors && errors.length > 0 && (
              <p className="text-xs text-red-500">{errors[0].message}</p>
            )}
          </div>
        );
      },
    },
  ],
};

/**
 * Register custom configurations
 * Call this in your plugin or app initialization
 */
export function registerCustomNodeConfigs() {
  // Register simple API node
  propertyRegistry.registerNodeConfig({
    nodeType: "ApiRequest",
    propertyGroups: simpleNodePropertyGroups,
  });

  // Register advanced database node
  propertyRegistry.registerNodeConfig({
    nodeType: "DatabaseQuery",
    propertyGroups: advancedNodePropertyGroups,
  });

  // Register node with custom renderer
  propertyRegistry.registerNodeConfig({
    nodeType: "ScheduledTask",
    propertyGroups: [customRendererExample],
  });

  console.log("[Custom Properties] Registered custom node configurations");
}
