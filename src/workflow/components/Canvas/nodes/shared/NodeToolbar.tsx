import { memo, type ReactNode } from "react";
import { cn, Tooltip } from "@sth87/shadcn-design-system";

export interface ToolbarItemProps {
  /**
   * Unique identifier for the toolbar item
   */
  id: string;

  /**
   * Icon or content to display in the button
   */
  icon: ReactNode;

  /**
   * Tooltip text to show on hover
   */
  tooltip?: string;

  /**
   * Click handler for the toolbar item
   */
  onClick: (e: React.MouseEvent) => void;

  /**
   * Whether the item is currently active/selected
   */
  isActive?: boolean;

  /**
   * Additional CSS classes for the button
   */
  className?: string;

  /**
   * Custom content to render (e.g., Popover). If provided, it will replace the default button.
   */
  customContent?: ReactNode;
}

export interface NodeToolbarProps {
  /**
   * Array of toolbar items to display
   */
  items: ToolbarItemProps[];

  /**
   * Whether the toolbar is visible (typically when node is selected)
   */
  visible?: boolean;

  /**
   * Additional CSS classes for the toolbar container
   */
  className?: string;

  /**
   * Position of the toolbar relative to the node
   * @default "top"
   */
  position?: "top" | "bottom";

  /**
   * Tooltip delay duration in milliseconds
   * @default 0
   */
  tooltipDelay?: number;

  /**
   * Tooltip side offset in pixels
   * @default 4
   */
  tooltipSideOffset?: number;
}

/**
 * Shared toolbar component for workflow nodes (Note, Annotation, Pool, etc.)
 * Provides a consistent UI for node actions with tooltip support
 */
function NodeToolbar({
  items,
  visible = true,
  className,
  position = "top",
  tooltipDelay = 0,
  tooltipSideOffset = 4,
}: NodeToolbarProps) {
  if (!visible) return null;

  const positionClasses = {
    top: "absolute -top-10 left-1/2 -translate-x-1/2",
    bottom: "absolute -bottom-10 left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={cn(
        positionClasses[position],
        "flex gap-1 bg-background rounded-md shadow-sm p-1 nodrag z-20",
        className
      )}
    >
      {items.map(item => {
        // If custom content is provided, render it directly
        if (item.customContent) {
          return <div key={item.id}>{item.customContent}</div>;
        }

        // Default button with optional tooltip
        const button = (
          <button
            onClick={item.onClick}
            className={cn(
              "p-1 hover:bg-accent rounded transition-colors",
              item.isActive && "bg-accent",
              item.className
            )}
          >
            {item.icon}
          </button>
        );

        // Wrap with tooltip if tooltip text is provided
        if (item.tooltip) {
          return (
            <Tooltip
              key={item.id}
              content={item.tooltip}
              delayDuration={tooltipDelay}
              sideOffset={tooltipSideOffset}
            >
              {button}
            </Tooltip>
          );
        }

        return <div key={item.id}>{button}</div>;
      })}
    </div>
  );
}

export default memo(NodeToolbar);
