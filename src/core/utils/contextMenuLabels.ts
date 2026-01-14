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
  resetColor: { en: "Reset Color", vi: "Đặt lại màu" },
  changeColor: { en: "Change Color", vi: "Đổi màu" },
  delete: { en: "Delete", vi: "Xóa" },
  changeType: { en: "Change Type", vi: "Đổi loại" },
  startType: { en: "Start Type", vi: "Loại bắt đầu" },
  taskType: { en: "Task Type", vi: "Loại nhiệm vụ" },
  gatewayType: { en: "Gateway Type", vi: "Loại cổng" },
  immediateType: { en: "Immediate Type", vi: "Loại tức thì" },
  endType: { en: "End Type", vi: "Loại kết thúc" },
  properties: { en: "Properties", vi: "Thuộc tính" },
  appearance: { en: "Appearance", vi: "Giao diện" },
  borderStyle: { en: "Border Style", vi: "Kiểu đường viền" },
  duplicate: { en: "Duplicate", vi: "Sao chép" },
  bezierCurved: { en: "Bezier (Curved)", vi: "Bezier (Cong)" },
  straight: { en: "Straight", vi: "Thẳng" },
  step: { en: "Step", vi: "Bước" },
  solid: { en: "Solid", vi: "Liền" },
  dashed: { en: "Dashed", vi: "Đứt đoạn" },
  dotted: { en: "Dotted", vi: "Chấm" },
  double: { en: "Double", vi: "Đôi" },
  enable: { en: "Enable", vi: "Bật" },
  disable: { en: "Disable", vi: "Tắt" },
  labelAtStart: { en: "Label at Start", vi: "Nhãn ở đầu" },
  labelAtCenter: { en: "Label at Center", vi: "Nhãn ở giữa" },
  labelAtEnd: { en: "Label at End", vi: "Nhãn ở cuối" },
  pathType: { en: "Path Type", vi: "Loại đường dẫn" },
  pathStyle: { en: "Path Style", vi: "Kiểu đường dẫn" },
  animation: { en: "Animation", vi: "Hiệu ứng" },
  addLabel: { en: "Add Label", vi: "Thêm nhãn" },
  yellow: { en: "Yellow", vi: "Vàng" },
  blue: { en: "Blue", vi: "Xanh" },
  green: { en: "Green", vi: "Xanh lá" },
  pink: { en: "Pink", vi: "Hồng" },
  purple: { en: "Purple", vi: "Tím" },
  orange: { en: "Orange", vi: "Cam" },
  gray: { en: "Gray", vi: "Xám" },
};

/**
 * Get a multilingual label object by key
 * @param key - The key of the label
 * @returns Object with language codes as keys
 */
export function getContextMenuLabel(key: keyof typeof contextMenuLabels): {
  [key: string]: string;
} {
  return contextMenuLabels[key] || { en: key, vi: key };
}
