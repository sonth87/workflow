/**
 * Properties Panel Component
 * Giống với ConfigPanel của workflow cũ
 */

import { X } from "lucide-react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import type {
  BaseNodeConfig,
  PropertyDefinition,
} from "@/core/types/base.types";
import { memo } from "react";

export const PropertiesPanel = memo(function PropertiesPanel() {
  const {
    nodes,
    edges,
    selectedNodeIds,
    selectedEdgeIds,
    updateNode,
    clearSelection,
  } = useWorkflowStore();

  const selectedNode =
    selectedNodeIds.length > 0
      ? nodes.find(n => n.id === selectedNodeIds[0])
      : null;

  const selectedEdge =
    selectedEdgeIds.length > 0
      ? edges.find(e => e.id === selectedEdgeIds[0])
      : null;

  if (!selectedNode && !selectedEdge) {
    return null;
  }

  const node = selectedNode as BaseNodeConfig | null;

  const handlePropertyChange = (propertyId: string, value: unknown) => {
    if (node) {
      updateNode(node.id, {
        properties: {
          ...node.properties,
          [propertyId]: value,
        },
      });
    }
  };

  const renderConfigNodeContent = () => {
    if (!node) {
      return (
        <p className="text-xs text-muted-foreground">
          Select a node to configure
        </p>
      );
    }

    // Dynamic Properties
    if (node.propertyDefinitions && node.propertyDefinitions.length > 0) {
      return (
        <div className="space-y-3">
          {node.propertyDefinitions.map(propDef => (
            <PropertyField
              key={propDef.id}
              definition={propDef}
              value={node.properties?.[propDef.id]}
              onChange={value => handlePropertyChange(propDef.id, value)}
            />
          ))}
        </div>
      );
    }

    return (
      <p className="text-xs text-muted-foreground">
        No configuration available for this node type
      </p>
    );
  };

  const renderConfigEdgeContent = () => {
    if (!selectedEdge) {
      return (
        <p className="text-xs text-muted-foreground">
          Select an edge to configure
        </p>
      );
    }
    return (
      <p className="text-xs text-muted-foreground">
        Edge configuration coming soon
      </p>
    );
  };

  return (
    <aside className="w-80 h-full border border-border/50 bg-card/95 backdrop-blur-sm overflow-y-auto rounded-xl shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
          Configuration
        </h2>
        <button
          onClick={() => clearSelection()}
          className="p-2 rounded-lg hover:bg-foreground/10"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4">
        {selectedNode && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {renderConfigNodeContent()}
          </div>
        )}
        {selectedEdge && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {renderConfigEdgeContent()}
          </div>
        )}
      </div>
    </aside>
  );
});

interface PropertyFieldProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

function PropertyField({ definition, value, onChange }: PropertyFieldProps) {
  const renderField = () => {
    switch (definition.type) {
      case "text":
      case "number":
        return (
          <input
            type={definition.type}
            value={(value as string | number) || ""}
            onChange={e =>
              onChange(
                definition.type === "number"
                  ? parseFloat(e.target.value)
                  : e.target.value
              )
            }
            placeholder={definition.placeholder}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        );

      case "textarea":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={e => onChange(e.target.value)}
            placeholder={definition.placeholder}
            rows={3}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        );

      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(value as boolean) || false}
              onChange={e => onChange(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">{definition.label}</span>
          </label>
        );

      case "select":
        return (
          <select
            value={(value as string) || ""}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select...</option>
            {definition.options?.map(opt => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "color":
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={(value as string) || "#000000"}
              onChange={e => onChange(e.target.value)}
              className="w-12 h-9 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={(value as string) || ""}
              onChange={e => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );

      case "json":
        return (
          <textarea
            value={
              typeof value === "string"
                ? value
                : JSON.stringify(value, null, 2) || ""
            }
            onChange={e => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                onChange(e.target.value);
              }
            }}
            placeholder={definition.placeholder || "{}"}
            rows={5}
            className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        );

      default:
        return (
          <div className="text-xs text-muted-foreground">
            Unsupported property type: {definition.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-1.5">
      {definition.type !== "boolean" && (
        <label className="text-xs font-medium text-foreground/90">
          {definition.label}
          {definition.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </label>
      )}
      {renderField()}
      {definition.description && (
        <p className="text-xs text-muted-foreground">
          {definition.description}
        </p>
      )}
    </div>
  );
}
