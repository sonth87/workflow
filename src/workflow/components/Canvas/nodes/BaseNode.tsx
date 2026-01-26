import type {
  BaseMetadata,
  NodeVisualConfig,
  IconConfig,
} from "@/core/types/base.types";
import { NodeType } from "@/enum/workflow.enum";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { nodeStyle, type CustomNodeProps } from ".";
import IconConfigComponent from "../../IconConfig";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { cn } from "@sth87/shadcn-design-system";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { propertyRegistry } from "@/core/properties";
import { useNodeActions } from "@/workflow/hooks";

// Deprecated: Use NodeVisualConfig from core types instead
export interface NodeColorConfig {
  backgroundColor?: string;
  borderColor?: string;
  ringColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export interface Props extends CustomNodeProps {
  children?: React.ReactNode;
  type?: NodeType;
  showHeader?: boolean;
  colorConfig?: NodeColorConfig; // Deprecated
  visualConfig?: NodeVisualConfig; // New: Use this instead
}

export default function BaseNode(props: Props) {
  const {
    children,
    type,
    data,
    showHeader = true,
    colorConfig,
    visualConfig,
  } = props;
  const { toggleNodeCollapse } = useNodeActions();
  const { compactView, layoutDirection, simulation } = useWorkflowStore();
  const { selectNode } = useWorkflowStore();
  const { getText } = useLanguage();

  // Get collapsed state from node data (default to false = expanded)
  const collapsed = data?.collapsed ?? false;
  const isExpanded = !collapsed;

  // Simulation highlight
  const isSimulationActive =
    simulation.active && simulation.currentNodeId === props.id;
  const isSimulationVisited =
    simulation.active && simulation.history.includes(props.id);

  // Check if node has configurable properties
  const hasProperties = type
    ? propertyRegistry
        .getNodePropertyGroups(type)
        .some(group => group.fields.some(field => !field.readonly))
    : false;

  // Access metadata
  const metadata = data?.metadata as BaseMetadata;
  const iconConfig = data?.icon as IconConfig | undefined;

  // Merge colorConfig (deprecated) with visualConfig (new)
  const finalVisualConfig: NodeVisualConfig = visualConfig || {
    backgroundColor: colorConfig?.backgroundColor,
    borderColor: colorConfig?.borderColor,
    ringColor: colorConfig?.ringColor,
    textColor: colorConfig?.titleColor,
    descriptionColor: colorConfig?.descriptionColor,
    iconBackgroundColor: colorConfig?.iconBgColor,
    iconColor: colorConfig?.iconColor,
  };

  // Build dynamic styles with border support
  const borderWidth = finalVisualConfig.borderWidth || 2;

  const containerStyle: React.CSSProperties = {
    ...(finalVisualConfig.backgroundColor && {
      backgroundColor: finalVisualConfig.backgroundColor,
    }),
    ...(finalVisualConfig.borderColor && {
      borderColor: finalVisualConfig.borderColor,
    }),
    ...(finalVisualConfig.borderStyle && {
      borderStyle: finalVisualConfig.borderStyle,
    }),
    ...(finalVisualConfig.borderWidth !== undefined && {
      borderWidth: `${finalVisualConfig.borderWidth}px`,
    }),
    ...(finalVisualConfig.borderRadius !== undefined && {
      borderRadius: `${finalVisualConfig.borderRadius}px`,
    }),
    ...(finalVisualConfig.opacity !== undefined && {
      opacity: finalVisualConfig.opacity,
    }),
    ...(finalVisualConfig.boxShadow && {
      boxShadow: finalVisualConfig.boxShadow,
    }),
    ...finalVisualConfig.customStyles,
  };

  const ringClasses = finalVisualConfig.ringColor ? "" : "ring-primary/25";
  const ringStyle = finalVisualConfig.ringColor
    ? { boxShadow: `0 0 0 4px ${finalVisualConfig.ringColor}` }
    : {};

  return (
    <div
      className={cn(
        compactView ? "group" : nodeStyle,
        compactView ? "" : "min-w-52 max-w-72",
        {
          "border-primary ring-4":
            props.selected &&
            !finalVisualConfig.borderColor &&
            !finalVisualConfig.ringColor,
          "ring-4": props.selected && finalVisualConfig.ringColor,
          "rounded p-0.5": compactView,
          [ringClasses]: props.selected && !finalVisualConfig.ringColor,
          "ring-8 ring-orange-500/50 border-orange-500 scale-105 transition-all duration-300":
            isSimulationActive,
          "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]":
            isSimulationVisited && !isSimulationActive,
        }
      )}
      style={{
        ...(!compactView && containerStyle),
        ...(props.selected && ringStyle),
        ...(finalVisualConfig.borderColor &&
          !compactView &&
          props.selected && { borderColor: finalVisualConfig.borderColor }),
      }}
      onDoubleClick={hasProperties ? () => selectNode(props.id) : undefined}
    >
      {compactView ? (
        // Compact view: icon only, text below or right, no border/background
        <div className="flex flex-row items-center relative">
          <div className="text-3xl">
            <IconConfigComponent
              type={type}
              colorConfig={colorConfig}
              visualConfig={visualConfig}
              icon={iconConfig}
              compactView={compactView}
            />
          </div>
          <div
            className={cn("text-xs font-semibold absolute", {
              "pt-2 top-full left-1/2 -translate-x-1/2 max-w-40 text-center":
                layoutDirection === "horizontal",
              "pl-4 top-1/2 left-full -translate-y-1/2 max-w-40":
                layoutDirection === "vertical",
            })}
          >
            <div className="truncate w-full">
              {getText(metadata.title || data?.label)}
            </div>
            {metadata?.description && (
              <div className="text-muted-foreground line-clamp-3 mt-1 text-xs font-normal w-40">
                {getText(metadata.description)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Header - always visible */}
          {showHeader && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <IconConfigComponent
                  type={type}
                  colorConfig={colorConfig}
                  visualConfig={visualConfig}
                  icon={iconConfig}
                />
                <span
                  className="text-sm font-semibold line-clamp-2"
                  style={{
                    color: finalVisualConfig.textColor,
                  }}
                >
                  {getText(data?.label as any)}
                </span>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleNodeCollapse(props.id, !collapsed);
                }}
                className="p-1 hover:bg-muted rounded transition-colors shrink-0"
              >
                {isExpanded ? (
                  <ChevronUp size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground" />
                )}
              </button>
            </div>
          )}

          {/* Description - toggleable, but Handles always render */}
          {isExpanded && metadata?.description && (
            <div
              className="text-xs mt-2"
              style={{
                color: finalVisualConfig.descriptionColor,
              }}
            >
              {getText(metadata.description)}
            </div>
          )}

          {/* Children (Handles) - always render, but visually hidden when collapsed */}
          <div
            className={cn({
              "opacity-0 h-0 overflow-hidden": !isExpanded && !showHeader,
            })}
          >
            {children}
          </div>
        </>
      )}

      {/* Children (Handles) always render for edges */}
      {compactView && children}
    </div>
  );
}
