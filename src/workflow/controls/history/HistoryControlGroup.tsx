/**
 * History Control Group
 */

import { UndoButton, type UndoButtonProps } from "./UndoButton";
import { RedoButton, type RedoButtonProps } from "./RedoButton";

export interface HistoryControlGroupProps {
  undoProps?: UndoButtonProps;
  redoProps?: RedoButtonProps;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function HistoryControlGroup({
  undoProps,
  redoProps,
  className = "",
  orientation = "horizontal",
}: HistoryControlGroupProps) {
  const flexDirection = orientation === "vertical" ? "flex-col" : "flex-row";

  return (
    <div className={`flex ${flexDirection} gap-2 ${className}`}>
      <UndoButton {...undoProps} />
      <RedoButton {...redoProps} />
    </div>
  );
}
