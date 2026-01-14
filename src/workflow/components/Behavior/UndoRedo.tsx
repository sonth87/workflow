import { useWorkflowStore } from "@/core";
import { Button, cn } from "@sth87/shadcn-design-system";
import { Redo2, Undo2 } from "lucide-react";

export type LayoutDirection = "vertical" | "horizontal";

interface UndoRedoProps {
  className?: string;
}

export function UndoRedo({ className }: UndoRedoProps) {
  const { undo, redo, history } = useWorkflowStore();
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button title="Undo" onClick={undo} disabled={!canUndo} color="muted">
        <Undo2 size={18} />
      </Button>
      <Button title="Redo" onClick={redo} disabled={!canRedo} color="muted">
        <Redo2 size={18} />
      </Button>
    </div>
  );
}
