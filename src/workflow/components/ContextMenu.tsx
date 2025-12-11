/**
 * Context Menu Component
 * Renders context menu for nodes and edges
 */

import { useEffect, useState } from "react";
import { contextMenuRegistry } from "@/core/registry/ContextMenuRegistry";
import type {
  ContextMenuItem,
  ContextMenuContext,
} from "@/core/types/base.types";

interface ContextMenuProps {
  x: number;
  y: number;
  context: ContextMenuContext;
  onClose: () => void;
}

// Component để render icon cho menu items
function MenuItemIcon({ icon, color }: { icon?: any; color?: string }) {
  if (color) {
    // Render color swatch
    return (
      <div
        className="w-4 h-4 rounded border border-gray-300 mr-2 shrink-0"
        style={{ backgroundColor: color }}
      />
    );
  }

  if (icon) {
    // Nếu icon là string (emoji hoặc text), hiển thị trực tiếp
    if (typeof icon === "string") {
      return <span className="mr-2 text-base shrink-0">{icon}</span>;
    }
    // Nếu là IconConfig, có thể mở rộng sau
    return <span className="mr-2 text-base shrink-0">{icon}</span>;
  }

  return null;
}

function ContextMenuItems({
  items,
  context,
  onClose,
}: {
  items: ContextMenuItem[];
  context: ContextMenuContext;
  onClose: () => void;
}) {
  return (
    <div className="py-1">
      {items.map(item => {
        // Check visibility
        if (item.visible && !item.visible(context)) {
          return null;
        }

        // Separator
        if (item.separator) {
          return <div key={item.id} className="my-1 h-px bg-border" />;
        }

        // Item with children (submenu)
        if (item.children && item.children.length > 0) {
          return (
            <div key={item.id} className="relative group">
              <button
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors flex items-center justify-between"
                disabled={item.disabled}
              >
                <div className="flex items-center flex-1">
                  <MenuItemIcon icon={item.icon} color={item.color} />
                  <span>{item.label}</span>
                </div>
                <span className="ml-2">›</span>
              </button>
              <div
                data-context-menu
                className="hidden group-hover:block absolute left-full top-0 ml-1 min-w-40 bg-popover border border-border rounded-md shadow-lg z-50"
              >
                <ContextMenuItems
                  items={item.children}
                  context={context}
                  onClose={onClose}
                />
              </div>
            </div>
          );
        }

        // Regular item
        return (
          <button
            key={item.id}
            className="w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={item.disabled}
            onClick={async () => {
              if (item.onClick) {
                await item.onClick(context);
              }
              onClose();
            }}
          >
            <MenuItemIcon icon={item.icon} color={item.color} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ContextMenu({ x, y, context, onClose }: ContextMenuProps) {
  const [items, setItems] = useState<ContextMenuItem[]>([]);

  useEffect(() => {
    // Get appropriate context menu items
    let menuItems: ContextMenuItem[] = [];

    if (context.nodeId && context.node) {
      menuItems = contextMenuRegistry.getNodeContextMenu(
        context.node.nodeType,
        context
      );
    } else if (context.edgeId && context.edge) {
      menuItems = contextMenuRegistry.getEdgeContextMenu(
        context.edge.edgeType,
        context
      );
    }

    setItems(menuItems);
  }, [context]);

  useEffect(() => {
    // Close on click outside - delay to avoid immediate close
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside context menu
      if (!target.closest("[data-context-menu]")) {
        onClose();
      }
    };

    // Add listener after a small delay to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      data-context-menu
      className="fixed z-50 min-w-[200px] bg-popover border border-border rounded-md shadow-lg"
      style={{
        left: x,
        top: y,
      }}
      onClick={e => e.stopPropagation()}
    >
      <ContextMenuItems items={items} context={context} onClose={onClose} />
    </div>
  );
}
