import { useWorkflowStore } from "@/core/store/workflowStore";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { Trash2, ArrowRight } from "lucide-react";
import { Input, Button } from "@sth87/shadcn-design-system";
import type { PropertyEntity } from "@/core/properties";

interface GatewayFlowsControlProps {
  entity: PropertyEntity;
}

export function GatewayFlowsControl({ entity }: GatewayFlowsControlProps) {
  const { edges, nodes, updateEdge, deleteEdge } = useWorkflowStore();
  const { getText } = useLanguage();

  // Only handle nodes (gateways)
  if (!("nodeType" in entity)) return null;

  const outgoingEdges = edges.filter((edge) => edge.source === entity.id);

  const handleConditionChange = (edgeId: string, condition: string) => {
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;

    updateEdge(edgeId, {
      properties: {
        ...edge.properties,
        condition,
      },
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          Outgoing Flows
        </label>
      </div>

      <div className="space-y-3">
        {outgoingEdges.map((edge) => {
          const targetNode = nodes.find((n) => n.id === edge.target);
          const targetLabel = targetNode
            ? getText(targetNode.data?.label || targetNode.metadata?.title)
            : edge.target;

          return (
            <div
              key={edge.id}
              className="p-3 border border-border rounded-lg bg-card/50 space-y-2 group relative transition-all hover:border-primary/30"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-primary/10 text-primary">
                    <ArrowRight size={12} />
                  </div>
                  <span className="text-xs font-bold truncate text-ink800">
                    {targetLabel}
                  </span>
                </div>
                <button
                  onClick={() => deleteEdge(edge.id)}
                  className="p-1.5 rounded-md text-ink400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete connection"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-1">
                <Input
                  label="Condition Expression"
                  value={(edge.properties?.condition as string) || ""}
                  onChange={(e) =>
                    handleConditionChange(edge.id, e.target.value)
                  }
                  placeholder="e.g. amount > 1000"
                  className="h-8 text-xs"
                />
              </div>
              <div className="text-[10px] text-ink400 font-mono truncate">
                ID: {edge.id}
              </div>
            </div>
          );
        })}

        {outgoingEdges.length === 0 && (
          <div className="text-center py-6 border border-dashed rounded-lg bg-muted/20">
            <p className="text-xs text-muted-foreground italic">
              No outgoing connections found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
