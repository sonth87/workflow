/**
 * Context Menu Component
 * Renders context menu for nodes and edges using design system
 */

import { useEffect, useState, useRef } from "react";
import DesignContextMenu from "@sth87/shadcn-design-system/contextmenu";
import { contextMenuRegistry } from "@/core/registry/ContextMenuRegistry";
import type {
  ContextMenuItem,
  ContextMenuContext,
} from "@/core/types/base.types";
import {
  getCategoryTypeLabel,
  createChangeTypeSubmenuItems,
} from "@/core/utils/contextMenuHelpers";
import { CategoryType } from "@/enum/workflow.enum";
import { Settings2 } from "lucide-react";
import { contextMenuActionsRegistry } from "@/core/registry";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import type { ReactNode } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  context: ContextMenuContext;
  onClose: () => void;
}

function transformMenuItems(
  items: ContextMenuItem[],
  context: ContextMenuContext,
  onClose: () => void,
  getText: (key: any) => string
): any[] {
  return items
    .filter(item => !item.visible || item.visible(context))
    .map(item => {
      if (item.separator) {
        return { type: "separator" };
      }

      const label = getText(item.label as any);
      const icon = item.color ? (
        <div
          className="w-4 h-4 rounded-lg shrink-0"
          style={{ backgroundColor: item.color }}
        />
      ) : (
        convertIcon(item.icon)
      );
      const onClick = item.onClick
        ? () => {
            item.onClick!(context);
            onClose();
          }
        : undefined;
      const children = item.children
        ? transformMenuItems(item.children, context, onClose, getText)
        : undefined;

      return {
        key: item.id,
        label,
        icon,
        onClick,
        children,
        disabled: item.disabled,
      };
    });
}

function convertIcon(icon: any): ReactNode {
  if (!icon) return null;

  if (typeof icon === "string") {
    return <span className="text-base shrink-0">{icon}</span>;
  }

  if (typeof icon === "object" && icon.type === "image" && icon.value) {
    return (
      <img
        src={icon.value}
        alt="icon"
        className="w-5 h-5 rounded-lg shrink-0"
      />
    );
  }

  if (typeof icon === "object" && icon.type === "lucide" && icon.value) {
    const IconComponent = icon.value;
    const size = icon.size || 16;
    const iconColor = icon.color;
    const backgroundColor = icon.backgroundColor;

    return (
      <div
        className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor }}
      >
        <IconComponent size={size} style={{ color: iconColor }} />
      </div>
    );
  }

  if (typeof icon === "function") {
    const IconComponent = icon;
    return (
      <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0">
        <IconComponent size={16} />
      </div>
    );
  }

  return null;
}

/**
 * Ensure Properties menu item exists for certain node categories
 */
function ensurePropertiesMenuItem(
  menuItems: ContextMenuItem[],
  context: ContextMenuContext
): ContextMenuItem[] {
  if (!context.node) return menuItems;

  const category = context.node.category as string;
  const requiresProperties = [
    CategoryType.START,
    CategoryType.TASK,
    CategoryType.GATEWAY,
    CategoryType.END,
  ].includes(category as CategoryType);

  if (!requiresProperties) return menuItems;

  // Check if Properties already exists
  const hasProperties = menuItems.some(item => item.id === "properties");
  if (hasProperties) return menuItems;

  // Add Properties menu item at the beginning
  const propertiesItem: ContextMenuItem = {
    id: "properties",
    label: "Properties",
    icon: {
      type: "lucide",
      value: Settings2,
    },
    onClick: async (ctx: ContextMenuContext) => {
      const action = contextMenuActionsRegistry.getAction("selectNode");
      if (action && ctx.nodeId) {
        action(ctx.nodeId);
      }
    },
  };

  return [propertiesItem, ...menuItems];
}

export function ContextMenu({ x, y, context, onClose }: ContextMenuProps) {
  const [items, setItems] = useState<ContextMenuItem[]>([]);
  const { getText } = useLanguage();
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get appropriate context menu items
    let menuItems: ContextMenuItem[] = [];

    if (context.nodeId && context.node) {
      menuItems = contextMenuRegistry.getNodeContextMenu(
        context.node.nodeType,
        context
      );

      // Populate Change Type menu dynamically
      menuItems = menuItems.map(item => {
        if (item.id === "change-type" && context.node) {
          const category = context.node.category as string;
          const onTypeChange = (item as any)._onTypeChange;
          const children = createChangeTypeSubmenuItems(
            context,
            onTypeChange || (async () => {})
          );

          return {
            ...item,
            label: getCategoryTypeLabel(category) as any,
            children,
          };
        }
        return item;
      });

      // Ensure Properties menu exists for certain categories
      menuItems = ensurePropertiesMenuItem(menuItems, context);
    } else if (context.edgeId && context.edge) {
      menuItems = contextMenuRegistry.getEdgeContextMenu(
        context.edge.edgeType as string,
        context
      );
    } else {
      menuItems = contextMenuRegistry.getCanvasContextMenu(context);
    }

    setItems(menuItems);
  }, [context]);

  const transformedItems = transformMenuItems(items, context, onClose, getText);

  useEffect(() => {
    if (triggerRef.current && transformedItems.length > 0) {
      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: x,
        clientY: y,
        button: 2, // right click
      });
      triggerRef.current.dispatchEvent(event);
    }
  }, [x, y, transformedItems]);

  if (transformedItems.length === 0) {
    return null;
  }

  return (
    <DesignContextMenu
      trigger={
        <div
          ref={triggerRef}
          style={{
            position: "fixed",
            left: x,
            top: y,
            width: 1,
            height: 1,
            zIndex: 50,
          }}
        />
      }
      items={transformedItems}
    />
  );
}
