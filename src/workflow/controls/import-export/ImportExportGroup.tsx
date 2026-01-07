/**
 * Import/Export Control Group
 */

import { ImportButton, type ImportButtonProps } from "./ImportButton";
import { ExportButton, type ExportButtonProps } from "./ExportButton";

export interface ImportExportGroupProps {
  importProps?: ImportButtonProps;
  exportProps?: ExportButtonProps;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function ImportExportGroup({
  importProps,
  exportProps,
  className = "",
  orientation = "horizontal",
}: ImportExportGroupProps) {
  const flexDirection = orientation === "vertical" ? "flex-col" : "flex-row";

  return (
    <div className={`flex ${flexDirection} gap-2 ${className}`}>
      <ImportButton {...importProps} />
      <ExportButton {...exportProps} />
    </div>
  );
}
