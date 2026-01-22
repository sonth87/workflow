/**
 * Context Menu Labels/Text Helper
 * Centralized translations for context menu items
 * This allows contextMenuHelpers to work without React/hooks while still supporting i18n
 *
 * Usage in React components:
 * ```tsx
 * import { useLanguage } from '@/workflow/hooks/useLanguage'
 * import { getContextMenuLabel } from '@/core/utils/contextMenuLabels'
 *
 * const { getText } = useLanguage()
 * const label = getText(getContextMenuLabel('resetColor'))
 * ```
 */

export const contextMenuLabels = {
  resetColor: "common.contextMenu.resetColor",
  changeColor: "common.contextMenu.changeColor",
  delete: "common.contextMenu.delete",
  changeType: "common.contextMenu.changeType",
  startType: "common.contextMenu.startType",
  taskType: "common.contextMenu.taskType",
  gatewayType: "common.contextMenu.gatewayType",
  immediateType: "common.contextMenu.immediateType",
  endType: "common.contextMenu.endType",
  properties: "common.contextMenu.properties",
  appearance: "common.contextMenu.appearance",
  borderStyle: "common.contextMenu.borderStyle",
  duplicate: "common.contextMenu.duplicate",
  bezierCurved: "common.contextMenu.bezierCurved",
  straight: "common.contextMenu.straight",
  step: "common.contextMenu.step",
  solid: "common.contextMenu.solid",
  dashed: "common.contextMenu.dashed",
  dotted: "common.contextMenu.dotted",
  double: "common.contextMenu.double",
  enable: "common.contextMenu.enable",
  disable: "common.contextMenu.disable",
  labelAtStart: "common.contextMenu.labelAtStart",
  labelAtCenter: "common.contextMenu.labelAtCenter",
  labelAtEnd: "common.contextMenu.labelAtEnd",
  pathType: "common.contextMenu.pathType",
  pathStyle: "common.contextMenu.pathStyle",
  animation: "common.contextMenu.animation",
  addLabel: "common.contextMenu.addLabel",
  yellow: "common.contextMenu.yellow",
  blue: "common.contextMenu.blue",
  green: "common.contextMenu.green",
  pink: "common.contextMenu.pink",
  purple: "common.contextMenu.purple",
  orange: "common.contextMenu.orange",
  gray: "common.contextMenu.gray",
  color: "common.contextMenu.color",
  fontSize: "common.contextMenu.fontSize",
  transparent: "common.contextMenu.transparent",
  extraSmall: "common.contextMenu.extraSmall",
  small: "common.contextMenu.small",
  base: "common.contextMenu.base",
  large: "common.contextMenu.large",
  black: "common.contextMenu.black",
  white: "common.contextMenu.white",
  red: "common.contextMenu.red",
  flipArrow: "common.contextMenu.flipArrow",
};

/**
 * Get a translation key for context menu label
 * @param key - The key of the label
 * @returns Translation key string
 */
export function getContextMenuLabel(
  key: keyof typeof contextMenuLabels
): string {
  return contextMenuLabels[key] || key;
}
