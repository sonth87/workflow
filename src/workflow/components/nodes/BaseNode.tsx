import React, { useState } from "react";
import { nodeStyle, type CustomNodeProps } from ".";
import { cx } from "@/utils/cx";
import { getIconConfig } from "@/workflow/utils/iconConfig";
import { NodeType } from "@/enum/workflow.enum";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { NodeVisualConfig } from "@/core/types/base.types";

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

/**
 * Convert border style to CSS border style string
 */
function getBorderStyleValue(
  style?: "solid" | "dashed" | "dotted" | "double"
): string {
  switch (style) {
    case "dashed":
      return "2px dashed";
    case "dotted":
      return "2px dotted";
    case "double":
      return "3px double";
    case "solid":
    default:
      return "2px solid";
  }
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

  const iconConfig = type ? getIconConfig(type) : null;
  const Icon = iconConfig?.icon;

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
  const borderStyle = getBorderStyleValue(finalVisualConfig.borderStyle);
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
      {showHeader && iconConfig && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {typeof Icon === "string" ? (
              <img
                src={Icon}
                alt={iconConfig.label}
                className="w-8 h-8 shrink-0"
              />
            ) : Icon ? (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    finalVisualConfig.iconBackgroundColor || iconConfig.bgColor,
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: finalVisualConfig.iconColor || iconConfig.color,
                  }}
                />
              </div>
            ) : null}
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
      {isExpanded && data?.label && (
        <div
          className="text-xs mt-2"
          style={{
            color: finalVisualConfig.descriptionColor,
          }}
        >
          {data.label}
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
