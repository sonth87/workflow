/**
 * Properties Panel Component
 * New architecture với tabs, dynamic rendering, và validation
 */

import { useWorkflowStore } from "@/core/store/workflowStore";
import { X } from "lucide-react";
import { memo } from "react";
import IconConfig from "../IconConfig";
import type { NodeType } from "@/enum/workflow.enum";
import { PropertyTabs } from "./PropertyTabs";
import { usePropertyGroups, useVisibleGroups } from "./hooks";
import type { BaseNodeConfig, BaseEdgeConfig } from "@/core/types/base.types";

export const PropertiesPanel = memo(function PropertiesPanel() {
  const { nodes, edges, selectedNodeId, selectedEdgeId, clearSelection } =
    useWorkflowStore();

  const selectedNode = selectedNodeId
    ? (nodes.find(n => n.id === selectedNodeId) as BaseNodeConfig | null)
    : null;

  const selectedEdge = selectedEdgeId
    ? (edges.find(e => e.id === selectedEdgeId) as BaseEdgeConfig | null)
    : null;

  const entity = selectedNode || selectedEdge;

  // Load property groups
  const propertyGroups = usePropertyGroups(entity);

  // Filter visible groups và fields
  const visibleGroups = useVisibleGroups(propertyGroups, entity);

  // Nếu không có entity nào được chọn
  if (!entity) {
    return null;
  }

  return (
    <aside className="w-80 h-full border border-border/50 bg-card/95 backdrop-blur-sm overflow-y-auto rounded-xl shadow-xl flex flex-col animate-in slide-in-from-right duration-200 absolute right-0 z-10">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedNode && (
              <IconConfig
                type={selectedNode.nodeType as NodeType}
                visualConfig={selectedNode.visualConfig}
              />
            )}
            <h2 className="text-sm font-semibold tracking-wide text-ink800">
              {selectedNode
                ? selectedNode.metadata?.title || "Node Properties"
                : "Edge Properties"}
            </h2>
          </div>
          <button
            onClick={() => clearSelection()}
            className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {selectedNode?.metadata?.description && (
          <p className="text-xs text-ink500 mt-1">
            {selectedNode.metadata.description}
          </p>
        )}
      </div>

      {/* Property Groups with Tabs */}
      <div className="flex-1 overflow-y-auto">
        <PropertyTabs groups={visibleGroups} entity={entity} />
      </div>
    </aside>
  );
});
