import React, { useState } from "react";
import { nodeStyle, type CustomNodeProps } from ".";
import { cx } from "@/utils/cx";
import { getIconConfig } from "@/workflow/utils/iconConfig";
import { NodeType } from "@/enum/workflow.enum";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface Props extends CustomNodeProps {
  children?: React.ReactNode;
  type?: NodeType;
  showHeader?: boolean;
}

export default function BaseNode(props: Props) {
  const { children, type, data, showHeader = true } = props;
  const [isExpanded, setIsExpanded] = useState(true);

  const iconConfig = type ? getIconConfig(type) : null;
  const Icon = iconConfig?.icon;

  return (
    <div
      className={cx(nodeStyle, "min-w-[280px]", {
        "border-primary ring-4 ring-primary/25": props.selected,
      })}
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
                style={{ backgroundColor: iconConfig.bgColor }}
              >
                <Icon size={18} style={{ color: iconConfig.color }} />
              </div>
            ) : null}
            <span className="text-sm font-semibold text-foreground truncate">
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
        <div className="text-xs text-muted-foreground mt-2">{data.label}</div>
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
