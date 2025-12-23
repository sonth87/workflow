import type { IconConfig as IconConfigType, NodeVisualConfig } from "@/core";
import type { NodeType } from "@/enum/workflow.enum";
import { getIconConfig } from "@/workflow/utils/iconConfig";
import type { NodeColorConfig } from "../Canvas/nodes/BaseNode";

interface Props {
  type?: NodeType;
  colorConfig?: NodeColorConfig; // Deprecated
  visualConfig?: NodeVisualConfig; // New: Use this instead
  icon?: IconConfigType; // Icon from node config
}

export default function IconConfig(props: Props) {
  const { type, colorConfig, visualConfig, icon: nodeIcon } = props;
  const finalVisualConfig: NodeVisualConfig = visualConfig || {
    backgroundColor: colorConfig?.backgroundColor,
    borderColor: colorConfig?.borderColor,
    ringColor: colorConfig?.ringColor,
    textColor: colorConfig?.titleColor,
    descriptionColor: colorConfig?.descriptionColor,
    iconBackgroundColor: colorConfig?.iconBgColor,
    iconColor: colorConfig?.iconColor,
  };

  // Priority: node icon > type icon
  let Icon: any = null;
  let iconBgColor: string | undefined;
  let iconColor: string | undefined;

  if (nodeIcon) {
    // Use icon from node config (from plugin)
    Icon = nodeIcon.value;
    iconBgColor =
      nodeIcon.backgroundColor || finalVisualConfig.iconBackgroundColor;
    iconColor = nodeIcon.color || finalVisualConfig.iconColor;
  } else if (type) {
    // Fallback to type-based icon
    const iconConfig = getIconConfig(type);
    Icon = iconConfig?.icon;
    iconBgColor = finalVisualConfig.iconBackgroundColor || iconConfig?.bgColor;
    iconColor = finalVisualConfig.iconColor || iconConfig?.color;
  }

  if (!Icon) return null;

  return (
    <>
      {typeof Icon === "string" ? (
        <img src={Icon} alt="icon" className="w-8 h-8 shrink-0" />
      ) : Icon ? (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: iconBgColor,
          }}
        >
          <Icon
            size={18}
            style={{
              color: iconColor,
            }}
          />
        </div>
      ) : null}
    </>
  );
}
