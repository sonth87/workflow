import {
  Plus,
  LockOpen,
  FlipVertical,
  Highlighter,
  Palette,
  Trash2,
} from "lucide-react";
import { contextMenuActionsRegistry } from "@/core/registry";
import {
  createDefaultNodeContextMenuItems,
  createDefaultEdgeContextMenuItems,
  createNoteNodeContextMenuItems,
  createAnnotationNodeContextMenuItems,
} from "@/core/utils/contextMenuHelpers";
import type { ContextMenuConfig } from "@/core/registry/ContextMenuRegistry";
import type { ContextMenuContext } from "@/core/types/base.types";

function generateSeparatorId(): string {
  return `separator-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const defaultContextMenus: Array<{
  id: string;
  type: string;
  name: string;
  config: ContextMenuConfig;
}> = [
  {
    id: "node-context-menu",
    type: "context-menu",
    name: "Node Context Menu",
    config: {
      id: "node-context-menu",
      name: "Node Context Menu",
      targetType: "node",
      items: createDefaultNodeContextMenuItems(
        async (paletteId: string, context: ContextMenuContext) => {
          const action =
            contextMenuActionsRegistry.getAction("changeNodeColor");
          if (action && context.nodeId) action(context.nodeId, paletteId);
        },
        async (borderStyle: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction(
            "changeNodeBorderStyle"
          );
          if (action && context.nodeId) action(context.nodeId, borderStyle);
        },
        async (context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("deleteNode");
          if (action && context.nodeId) action(context.nodeId);
        },
        async (targetNodeType: string, context: ContextMenuContext) => {
          const action =
            contextMenuActionsRegistry.getAction("convertNodeType");
          if (action && context.nodeId) action(context.nodeId, targetNodeType);
        }
      ),
    },
  },
  {
    id: "edge-context-menu",
    type: "context-menu",
    name: "Edge Context Menu",
    config: {
      id: "edge-context-menu",
      name: "Edge Context Menu",
      targetType: "edge",
      items: createDefaultEdgeContextMenuItems(
        async (paletteId: string, context: ContextMenuContext) => {
          const action =
            contextMenuActionsRegistry.getAction("changeEdgeColor");
          if (action && context.edgeId) action(context.edgeId, paletteId);
        },
        async (pathType: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("changePathType");
          if (action && context.edgeId) action(context.edgeId, pathType);
        },
        async (pathStyle: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction(
            "changeEdgePathStyle"
          );
          if (action && context.edgeId) action(context.edgeId, pathStyle);
        },
        async (animated: boolean, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction(
            "changeEdgeAnimation"
          );
          if (action && context.edgeId) action(context.edgeId, animated);
        },
        async (
          position: "start" | "center" | "end",
          context: ContextMenuContext
        ) => {
          const action = contextMenuActionsRegistry.getAction("addEdgeLabel");
          if (action && context.edgeId) action(context.edgeId, position);
        },
        async (context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("deleteEdge");
          if (action && context.edgeId) action(context.edgeId);
        }
      ),
    },
  },
  {
    id: "canvas-context-menu",
    type: "context-menu",
    name: "Canvas Context Menu",
    config: {
      id: "canvas-context-menu",
      name: "Canvas Context Menu",
      targetType: "canvas",
      items: [
        {
          id: "add-node",
          label: "common.contextMenu.addNode",
          icon: "",
          onClick: async () => {
            console.log("Add node action triggered");
          },
          children: [
            {
              id: "add-start-node",
              label: "common.contextMenu.addStartNode",
              icon: "○",
              onClick: async (context: ContextMenuContext) => {
                console.log("Add Start Node clicked", context);
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: "note-node-context-menu",
    type: "context-menu",
    name: "Note Node Context Menu",
    config: {
      id: "note-node-context-menu",
      name: "Note Node Context Menu",
      targetType: "node",
      targetNodeTypes: ["note"],
      items: createNoteNodeContextMenuItems(
        async (color: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("updateNodeData");
          if (action && context.nodeId) action(context.nodeId, { color });
        }
      ),
    },
  },
  {
    id: "annotation-node-context-menu",
    type: "context-menu",
    name: "Annotation Node Context Menu",
    config: {
      id: "annotation-node-context-menu",
      name: "Annotation Node Context Menu",
      targetType: "node",
      targetNodeTypes: ["annotation"],
      items: createAnnotationNodeContextMenuItems(
        async (color: string, context: ContextMenuContext) => {
          const action = contextMenuActionsRegistry.getAction("updateNodeData");
          if (action && context.nodeId)
            action(context.nodeId, { textColor: color });
        }
      ),
    },
  },
  {
    id: "pool-lane-context-menu",
    type: "context-menu",
    name: "Pool/Lane Context Menu",
    config: {
      id: "pool-lane-context-menu",
      name: "Pool/Lane Context Menu",
      targetType: "node",
      targetNodeTypes: ["pool", "lane"],
      items: [
        {
          id: "add-lane",
          label: "common.contextMenu.addLane",
          icon: { type: "lucide", value: Plus },
          onClick: async (context: ContextMenuContext) => {
            const action =
              contextMenuActionsRegistry.getAction("updateNodeData");
            if (action && context.nodeId && context.node) {
              const currentLanes = (context.node.data?.lanes as any[]) || [];
              const newLane = {
                id: `lane-${Date.now()}`,
                label: `Lane ${currentLanes.length + 1}`,
              };
              action(context.nodeId, { lanes: [...currentLanes, newLane] });
            }
          },
          visible: (context: ContextMenuContext) =>
            context.node?.type === "pool",
        },
        {
          id: "toggle-lock",
          label: "common.contextMenu.toggleLockMode",
          icon: { type: "lucide", value: LockOpen },
          onClick: async (context: ContextMenuContext) => {
            const action =
              contextMenuActionsRegistry.getAction("updateNodeData");
            if (action && context.nodeId && context.node) {
              const currentLockState = context.node.data?.isLocked ?? false;
              action(context.nodeId, { isLocked: !currentLockState });
            }
          },
        },
        {
          id: "switch-orientation",
          label: "common.contextMenu.switchOrientation",
          icon: { type: "lucide", value: FlipVertical },
          onClick: async (context: ContextMenuContext) => {
            const action =
              contextMenuActionsRegistry.getAction("updateNodeData");
            if (action && context.nodeId && context.node) {
              const currentOrientation =
                context.node.data?.orientation || "horizontal";
              const newOrientation =
                currentOrientation === "horizontal" ? "vertical" : "horizontal";
              action(context.nodeId, { orientation: newOrientation });
            }
          },
        },
        {
          id: generateSeparatorId(),
          label: "",
          separator: true,
        },
        {
          id: "appearance",
          label: "common.contextMenu.appearance",
          icon: { type: "lucide", value: Highlighter },
          children: [
            {
              id: "color-submenu",
              label: "common.contextMenu.changeColor",
              icon: { type: "lucide", value: Palette },
              children: [
                {
                  id: "color-yellow",
                  label: "common.contextMenu.yellow",
                  color: "#fde68a",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId)
                      action(context.nodeId, { color: "yellow" });
                  },
                },
                {
                  id: "color-blue",
                  label: "common.contextMenu.blue",
                  color: "#bfdbfe",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId)
                      action(context.nodeId, { color: "blue" });
                  },
                },
                {
                  id: "color-green",
                  label: "common.contextMenu.green",
                  color: "#d9f99d",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId)
                      action(context.nodeId, { color: "green" });
                  },
                },
                {
                  id: "color-pink",
                  label: "common.contextMenu.pink",
                  color: "#fecdd3",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId)
                      action(context.nodeId, { color: "pink" });
                  },
                },
                {
                  id: "color-purple",
                  label: "common.contextMenu.purple",
                  color: "#ddd6fe",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId)
                      action(context.nodeId, { color: "purple" });
                  },
                },
                {
                  id: "color-orange",
                  label: "common.contextMenu.orange",
                  color: "#fed7aa",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId)
                      action(context.nodeId, { color: "orange" });
                  },
                },
                {
                  id: "color-gray",
                  label: "common.contextMenu.gray",
                  color: "#e4e4e7",
                  onClick: async (context: ContextMenuContext) => {
                    const action =
                      contextMenuActionsRegistry.getAction("updateNodeData");
                    if (action && context.nodeId)
                      action(context.nodeId, { color: "gray" });
                  },
                },
              ],
            },
          ],
          visible: (context: ContextMenuContext) =>
            context.node?.type === "pool",
        },
        {
          id: generateSeparatorId(),
          label: "",
          separator: true,
        },
        {
          id: "delete-pool-lane",
          label: "common.contextMenu.deletePool",
          icon: { type: "lucide", value: Trash2, color: "red" },
          onClick: async (context: ContextMenuContext) => {
            const action = contextMenuActionsRegistry.getAction(
              "deletePoolWithConfirmation"
            );
            if (action && context.nodeId) action(context.nodeId);
          },
        },
      ],
    },
  },
];
