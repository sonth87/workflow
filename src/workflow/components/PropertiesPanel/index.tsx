/**
 * Properties Panel Component
 * Giống với ConfigPanel của workflow cũ
 */

import { useWorkflowStore } from "@/core/store/workflowStore";
import type {
  BaseNodeConfig,
  PropertyDefinition,
} from "@/core/types/base.types";
import { X } from "lucide-react";
import { memo, useMemo } from "react";
import IconConfig from "../IconConfig";
import type { NodeType } from "@/enum/workflow.enum";
import { mergeWithBaseProperties } from "@/core/constants/baseProperties";
import {
  TextInput,
  NumberInput,
  TextArea,
  Select,
  BooleanInput,
  ColorInput,
  JsonInput,
} from "./ControlType";

export const PropertiesPanel = memo(function PropertiesPanel() {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    updateNode,
    clearSelection,
  } = useWorkflowStore();

  const selectedNode = selectedNodeId
    ? nodes.find(n => n.id === selectedNodeId)
    : null;

  const selectedEdge = selectedEdgeId
    ? edges.find(e => e.id === selectedEdgeId)
    : null;

  if (!selectedNode && !selectedEdge) {
    return null;
  }

  const node = selectedNode as BaseNodeConfig | null;

  // Merge base properties với custom properties
  const allPropertyDefinitions = useMemo(() => {
    if (!node) return [];
    return mergeWithBaseProperties(node.propertyDefinitions);
  }, [node?.propertyDefinitions]);

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

    // Sử dụng merged properties (base + custom)
    if (allPropertyDefinitions && allPropertyDefinitions.length > 0) {
      return (
        <div className="space-y-3">
          {allPropertyDefinitions.map(propDef => (
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
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconConfig
              type={selectedNode?.nodeType as NodeType}
              visualConfig={selectedNode?.visualConfig}
            />
            <h2 className="text-sm font-semibold tracking-wide text-ink800">
              {selectedNode ? selectedNode?.metadata?.title : "Edge Properties"}
            </h2>
          </div>
          <button
            onClick={() => clearSelection()}
            className="p-2 rounded-lg hover:bg-foreground/10"
          >
            <X size={16} />
          </button>
        </div>
        {selectedNode?.metadata?.description && (
          <p className="text-xs text-ink500 mt-1">
            {selectedNode?.metadata?.description}
          </p>
        )}
      </div>

      <div className="p-4">
        {selectedNode && (
          <div className="space-y-4 flex-1 overflow-y-auto p-0.5">
            {renderConfigNodeContent()}
          </div>
        )}
        {selectedEdge && (
          <div className="space-y-4 flex-1 overflow-y-auto p-0.5">
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
        return (
          <TextInput
            definition={definition}
            value={value}
            onChange={onChange}
          />
        );

      case "number":
        return (
          <NumberInput
            definition={definition}
            value={value}
            onChange={onChange}
          />
        );

      case "textarea":
        return (
          <TextArea definition={definition} value={value} onChange={onChange} />
        );

      case "boolean":
        return (
          <BooleanInput
            definition={definition}
            value={value}
            onChange={onChange}
          />
        );

      case "select":
        return (
          <Select definition={definition} value={value} onChange={onChange} />
        );

      case "color":
        return (
          <ColorInput
            definition={definition}
            value={value}
            onChange={onChange}
          />
        );

      case "json":
        return (
          <JsonInput
            definition={definition}
            value={value}
            onChange={onChange}
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
