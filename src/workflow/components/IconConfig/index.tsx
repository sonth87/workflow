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

  // Priority: type icon (iconConfig.ts) > node icon (plugin config)
  // This allows specific SVG icons to override generic plugin icons
  // while still supporting inheritance for custom nodes
  let Icon: any = null;
  let iconBgColor: string | undefined;
  let iconColor: string | undefined;

  // First, try type-based icon from iconConfig.ts
  if (type) {
    const iconConfig = getIconConfig(type);
    if (iconConfig?.icon) {
      Icon = iconConfig.icon;
      iconBgColor = finalVisualConfig.iconBackgroundColor || iconConfig.bgColor;
      iconColor = finalVisualConfig.iconColor || iconConfig.color;
    }
  }

  // Fallback to node icon from plugin config (for inheritance & custom nodes)
  if (!Icon && nodeIcon) {
    if (typeof nodeIcon === "string") {
      // Handle base64 string icon
      Icon = nodeIcon;
      iconBgColor = finalVisualConfig.iconBackgroundColor;
      iconColor = finalVisualConfig.iconColor;
    } else if (nodeIcon.type === "image" || nodeIcon.type === "svg") {
      // Handle image or svg from node config
      Icon = nodeIcon.value;
      iconBgColor = finalVisualConfig.iconBackgroundColor;
      iconColor = finalVisualConfig.iconColor;
    } else {
      // Use icon from node config (from plugin)
      Icon = nodeIcon.value;
      iconBgColor =
        nodeIcon.backgroundColor || finalVisualConfig.iconBackgroundColor;
      iconColor = nodeIcon.color || finalVisualConfig.iconColor;
    }
  }

  if (!Icon) return null;

  // Validate Icon to prevent "Element type is invalid" error
  // If Icon is an object but has no keys (and isn't a special React object),
  // it's likely a serialized component which is invalid to render.
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
            style={{
              color: !compactView ? iconColor : iconBgColor || defaultColor,
            }}
          />
        </div>
      ) : null}
    </>
  );
}
