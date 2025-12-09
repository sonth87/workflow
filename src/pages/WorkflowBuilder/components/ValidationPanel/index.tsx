import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface ValidationError {
  nodeId: string;
  message: string;
  type: "error" | "warning";
}

interface ValidationPanelProps {
  errors: ValidationError[];
  onClose?: () => void;
  onNodeSelect?: (nodeId: string) => void;
}

export function ValidationPanel({
  errors,
  onClose,
  onNodeSelect,
}: ValidationPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const errorCount = errors.filter(e => e.type === "error").length;
  const warningCount = errors.filter(e => e.type === "warning").length;

  if (errors.length === 0) return null;

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
            {onClose && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="max-h-60 overflow-y-auto p-2">
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div
                  key={`${error.nodeId}-${index}`}
                  onClick={() => onNodeSelect?.(error.nodeId)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    error.type === "error"
                      ? "bg-destructive/10 border-destructive/30 hover:border-destructive"
                      : "bg-warning/10 border-warning/30 hover:border-warning"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        error.type === "error" ? "bg-destructive" : "bg-warning"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {error.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Node: {error.nodeId}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        error.type === "error"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-warning/20 text-warning"
                      }`}
                    >
                      {error.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
