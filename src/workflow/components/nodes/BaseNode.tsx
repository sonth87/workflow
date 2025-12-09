import React, { useState } from "react";
import { nodeStyle, type CustomNodeProps } from ".";
import { cx } from "@/utils/cx";
import { getIconConfig } from "@/workflow/utils/iconConfig";
import { NodeType } from "@/enum/workflow.enum";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  colorConfig?: NodeColorConfig;
}

export default function BaseNode(props: Props) {
  const { children, type, data, showHeader = true, colorConfig } = props;
  const [isExpanded, setIsExpanded] = useState(true);

  const iconConfig = type ? getIconConfig(type) : null;
  const Icon = iconConfig?.icon;

  // Build dynamic styles
  const containerStyle: React.CSSProperties = {
    ...(colorConfig?.backgroundColor && {
      backgroundColor: colorConfig.backgroundColor,
    }),
    ...(colorConfig?.borderColor && { borderColor: colorConfig.borderColor }),
  };

  const ringClasses = colorConfig?.ringColor ? "" : "ring-primary/25";
  const ringStyle = colorConfig?.ringColor
    ? { boxShadow: `0 0 0 4px ${colorConfig.ringColor}` }
    : {};

  return (
    <div
      className={cx(nodeStyle, "min-w-[280px]", {
        "border-primary ring-4":
          props.selected &&
          !colorConfig?.borderColor &&
          !colorConfig?.ringColor,
        "ring-4": props.selected && colorConfig?.ringColor,
        [ringClasses]: props.selected && !colorConfig?.ringColor,
      })}
      style={{
        ...containerStyle,
        ...(props.selected && ringStyle),
        ...(colorConfig?.borderColor &&
          props.selected && { borderColor: colorConfig.borderColor }),
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
                    colorConfig?.iconBgColor || iconConfig.bgColor,
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: colorConfig?.iconColor || iconConfig.color,
                  }}
                />
              </div>
            ) : null}
            <span
              className="text-sm font-semibold truncate"
              style={{
                color: colorConfig?.titleColor,
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
            color: colorConfig?.descriptionColor,
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
