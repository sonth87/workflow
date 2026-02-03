import type { IconConfig as IconConfigType, NodeVisualConfig } from "@/core";
import type { NodeType } from "@/enum/workflow.enum";
import { getIconConfig } from "@/workflow/utils/iconConfig";
import type { NodeColorConfig } from "../Canvas/nodes/BaseNode";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@sth87/shadcn-design-system";

interface Props {
  type?: NodeType;
  colorConfig?: NodeColorConfig; // Deprecated
  visualConfig?: NodeVisualConfig; // New: Use this instead
  icon?: IconConfigType; // Icon from node config
  compactView?: boolean;
  className?: string;
  size?: number;
}

export default function IconConfig(props: Props) {
  const {
    type,
    colorConfig,
    visualConfig,
    icon: nodeIcon,
    compactView,
    className,
    size,
  } = props;
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const defaultColor = isDark ? "#FFF" : "#000";

  const finalVisualConfig: NodeVisualConfig = visualConfig || {
    backgroundColor: colorConfig?.backgroundColor,
    borderColor: colorConfig?.borderColor,
    ringColor: colorConfig?.ringColor,
    textColor: colorConfig?.titleColor,
    descriptionColor: colorConfig?.descriptionColor,
    iconBackgroundColor: colorConfig?.iconBgColor,
    iconColor: colorConfig?.iconColor,
  };

  /**
   * Priority for icon selection:
   * 1. iconConfig.ts - Default icons for each node type (highest priority)
   * 2. Node config - Icons from plugin/registry (may be inherited or custom)
   *
   * This ensures:
   * - Standard node types use their designated icons from iconConfig.ts
   * - Nodes without iconConfig definition use plugin config (with inheritance)
   * - Custom nodes can override via iconConfig.ts
   */
  let Icon: any = null;
  let iconBgColor: string | undefined;
  let iconColor: string | undefined;

  // Priority 1: Check iconConfig.ts for type-specific icon
  if (type) {
    const typeIconConfig = getIconConfig(type);
    if (typeIconConfig?.icon) {
      Icon = typeIconConfig.icon;
      // Use colors from iconConfig.ts directly (don't allow visualConfig to override)
      iconBgColor = typeIconConfig.bgColor;
      iconColor = typeIconConfig.color;
    }
  }

  // Priority 2: Fallback to node icon from plugin config (supports inheritance)
  if (!Icon && nodeIcon) {
    if (typeof nodeIcon === "string") {
      // Handle base64 string icon
      Icon = nodeIcon;
      iconBgColor = finalVisualConfig.iconBackgroundColor;
      iconColor = finalVisualConfig.iconColor;
    } else if (nodeIcon.type === "lucide" && nodeIcon.value) {
      // Handle Lucide icon component from plugin
      Icon = nodeIcon.value;
      iconBgColor =
        nodeIcon.backgroundColor || finalVisualConfig.iconBackgroundColor;
      iconColor = nodeIcon.color || finalVisualConfig.iconColor;
    } else if (nodeIcon.type === "image" || nodeIcon.type === "svg") {
      // Handle image or svg from node config
      Icon = nodeIcon.value;
      iconBgColor = finalVisualConfig.iconBackgroundColor;
      iconColor = finalVisualConfig.iconColor;
    } else if (nodeIcon.value) {
      // Generic icon value
      Icon = nodeIcon.value;
      iconBgColor =
        nodeIcon.backgroundColor || finalVisualConfig.iconBackgroundColor;
      iconColor = nodeIcon.color || finalVisualConfig.iconColor;
    }
  }

  if (!Icon) return null;

  // Validate Icon to prevent "Element type is invalid" error
  if (
    typeof Icon === "object" &&
    Icon !== null &&
    Object.keys(Icon).length === 0 &&
    !(Icon as any).$$typeof
  ) {
    return null;
  }

  return (
    <>
      {typeof Icon === "string" ? (
        <img
          src={Icon}
          alt="icon"
          className={cn("w-8 h-8 rounded-lg shrink-0", className)}
        />
      ) : Icon ? (
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            className
          )}
          style={{
            backgroundColor: !compactView ? iconBgColor : undefined,
          }}
        >
          <Icon
            size={compactView ? 32 : size || 18}
            color={!compactView ? iconColor : iconBgColor || defaultColor}
            style={{
              color: !compactView ? iconColor : iconBgColor || defaultColor,
            }}
          />
        </div>
      ) : null}
    </>
  );
}
