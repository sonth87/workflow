/**
 * Layout Control Group
 */

import {
  LayoutDirectionControl,
  type LayoutDirectionControlProps,
} from "./LayoutDirectionControl";
import { FitViewButton, type FitViewButtonProps } from "./FitViewButton";
import {
  AutoLayoutButton,
  type AutoLayoutButtonProps,
} from "./AutoLayoutButton";

export interface LayoutControlGroupProps {
  directionProps?: LayoutDirectionControlProps;
  fitViewProps?: FitViewButtonProps;
  autoLayoutProps?: AutoLayoutButtonProps;
  className?: string;
  orientation?: "horizontal" | "vertical";
  showDirection?: boolean;
  showFitView?: boolean;
  showAutoLayout?: boolean;
}

export function LayoutControlGroup({
  directionProps,
  fitViewProps,
  autoLayoutProps,
  className = "",
  orientation = "horizontal",
  showDirection = true,
  showFitView = true,
  showAutoLayout = true,
}: LayoutControlGroupProps) {
  const flexDirection = orientation === "vertical" ? "flex-col" : "flex-row";

  return (
    <div className={`flex ${flexDirection} gap-2 ${className}`}>
      {showDirection && <LayoutDirectionControl {...directionProps} />}
      {showFitView && <FitViewButton {...fitViewProps} />}
      {showAutoLayout && <AutoLayoutButton {...autoLayoutProps} />}
    </div>
  );
}
