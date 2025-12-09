/**
 * Validation Panel Component
 * Giống với ValidationPanel của workflow cũ
 */

import { AlertCircle, AlertTriangle } from "lucide-react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { memo, useMemo, useState } from "react";

interface ValidationPanelProps {
  onNodeSelect?: (nodeId: string) => void;
}

export const ValidationPanel = memo(function ValidationPanel({
  onNodeSelect,
}: ValidationPanelProps) {
  const { validationErrors } = useWorkflowStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const errors = useMemo(
    () => validationErrors.filter(e => e.type === "error"),
    [validationErrors]
  );

  const warnings = useMemo(
    () => validationErrors.filter(e => e.type === "warning"),
    [validationErrors]
  );

  if (validationErrors.length === 0) {
    return null;
  }

  const errorCount = errors.length;
  const warningCount = warnings.length;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <h3 className="text-sm font-semibold">Workflow Validation</h3>
              <p className="text-xs text-muted-foreground">
                {errorCount > 0 &&
                  `${errorCount} error${errorCount > 1 ? "s" : ""}`}
                {errorCount > 0 && warningCount > 0 && ", "}
                {warningCount > 0 &&
                  `${warningCount} warning${warningCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                setIsCollapsed(!isCollapsed);
              }}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="max-h-60 overflow-y-auto p-2">
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div
                  key={`${error.nodeId}-${index}`}
                  onClick={() => error.nodeId && onNodeSelect?.(error.nodeId)}
                  className="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-destructive/10 border-destructive/30 hover:border-destructive"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-destructive mb-0.5">
                        Node: {error.nodeId}
                      </div>
                      <div className="text-xs text-foreground/70">
                        {error.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {warnings.map((warning, index) => (
                <div
                  key={`${warning.nodeId}-${index}`}
                  onClick={() =>
                    warning.nodeId && onNodeSelect?.(warning.nodeId)
                  }
                  className="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-warning/10 border-warning/30 hover:border-warning"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-warning mb-0.5">
                        Node: {warning.nodeId}
                      </div>
                      <div className="text-xs text-foreground/70">
                        {warning.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
