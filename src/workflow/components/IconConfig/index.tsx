import type { NodeVisualConfig } from "@/core";
import type { NodeType } from "@/enum/workflow.enum";
import { getIconConfig } from "@/workflow/utils/iconConfig";
import type { NodeColorConfig } from "../Canvas/nodes/BaseNode";

interface Props {
  type?: NodeType;
  colorConfig?: NodeColorConfig; // Deprecated
  visualConfig?: NodeVisualConfig; // New: Use this instead
}

export default function IconConfig(props: Props) {
  const { type, colorConfig, visualConfig } = props;
  const finalVisualConfig: NodeVisualConfig = visualConfig || {
    backgroundColor: colorConfig?.backgroundColor,
    borderColor: colorConfig?.borderColor,
    ringColor: colorConfig?.ringColor,
    textColor: colorConfig?.titleColor,
    descriptionColor: colorConfig?.descriptionColor,
    iconBackgroundColor: colorConfig?.iconBgColor,
    iconColor: colorConfig?.iconColor,
  };

  const iconConfig = type ? getIconConfig(type) : null;
  const Icon = iconConfig?.icon;

  if (!Icon) return null;

  return (
    <>
      {typeof Icon === "string" ? (
        <img src={Icon} alt={iconConfig.label} className="w-8 h-8 shrink-0" />
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
    </>
  );
}
