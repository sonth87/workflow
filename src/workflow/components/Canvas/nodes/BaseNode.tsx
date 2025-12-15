import type { BaseMetadata, NodeVisualConfig } from "@/core/types/base.types";
import { NodeType } from "@/enum/workflow.enum";
import { cx } from "@/utils/cx";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { nodeStyle, type CustomNodeProps } from ".";
import IconConfig from "../../IconConfig";

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
  const [isExpanded, setIsExpanded] = useState(true);

  // Access metadata
  const metadata = data?.metadata as BaseMetadata;

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
      borderStyle: finalVisualConfig.borderStyle || "solid",
      borderWidth: `${borderWidth}px`,
    }),
    ...(finalVisualConfig.borderRadius && {
      borderRadius: `${finalVisualConfig.borderRadius}px`,
    }),
    ...(finalVisualConfig.opacity && {
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
      className={cx(nodeStyle, "min-w-[280px]", {
        "border-primary ring-4":
          props.selected &&
          !finalVisualConfig.borderColor &&
          !finalVisualConfig.ringColor,
        "ring-4": props.selected && finalVisualConfig.ringColor,
        [ringClasses]: props.selected && !finalVisualConfig.ringColor,
      })}
      style={{
        ...containerStyle,
        ...(props.selected && ringStyle),
        ...(finalVisualConfig.borderColor &&
          props.selected && { borderColor: finalVisualConfig.borderColor }),
      }}
    >
      {/* Header - always visible */}
      {showHeader && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <IconConfig
              type={type}
              colorConfig={colorConfig}
              visualConfig={visualConfig}
            />
            <span
              className="text-sm font-semibold truncate"
              style={{
                color: finalVisualConfig.textColor,
              }}
            >
              {data?.label}
            </span>
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
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
          {metadata?.description}
        </div>
      )}

      {/* Children (Handles) - always render, but visually hidden when collapsed */}
      <div
        className={cx({
          "opacity-0 h-0 overflow-hidden": !isExpanded && !showHeader,
        })}
      >
        {children}
      </div>
    </div>
  );
}
