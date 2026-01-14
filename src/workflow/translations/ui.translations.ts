/**
 * UI Translations Dictionary
 *
 * This file contains all user-facing UI text for multilingual support.
 * Structure allows for flexible language configuration by external projects.
 *
 * Usage in external projects:
 * ```
 * import { DEFAULT_UI_TRANSLATIONS, UITranslations } from 'bpm-core/translations'
 *
 * const customTranslations: UITranslations = {
 *   ...DEFAULT_UI_TRANSLATIONS,
 *   toolbar: {
 *     ...DEFAULT_UI_TRANSLATIONS.toolbar,
 *     selectTool: { en: "Custom Select", vi: "Chọn tùy chỉnh" }
 *   }
 * }
 *
 * // Pass to LanguageProvider
 * ```
 */

export interface UITranslations {
  toolbar: {
    selectTool: { [key: string]: string };
    handTool: { [key: string]: string };
    zoomOut: { [key: string]: string };
    zoomIn: { [key: string]: string };
    resetView: { [key: string]: string };
    fullscreen: { [key: string]: string };
    moreOptions: { [key: string]: string };
    options: { [key: string]: string };
    minimap: { [key: string]: string };
  };
  toolbox: {
    expandToolbox: { [key: string]: string };
    minimizeToolbox: { [key: string]: string };
    collapseToolbox: { [key: string]: string };
    toolbox: { [key: string]: string };
  };
  properties: {
    nodeProperties: { [key: string]: string };
    edgeProperties: { [key: string]: string };
    noPropertiesAvailable: { [key: string]: string };
    noPropertyGroupsAvailable: { [key: string]: string };
    selectNodeToConfigure: { [key: string]: string };
    noConfigurationAvailable: { [key: string]: string };
    selectEdgeToConfigure: { [key: string]: string };
  };
  multiSelect: {
    enterValuesPlaceholder: { [key: string]: string };
  };
  noteNode: {
    changeColor: { [key: string]: string };
    changeFontSize: { [key: string]: string };
    typePlaceholder: { [key: string]: string };
    styledWithMarkdown: { [key: string]: string };
    small: { [key: string]: string };
    normal: { [key: string]: string };
    extraSmall: { [key: string]: string };
    large: { [key: string]: string };
  };
  annotationNode: {
    changeTextColor: { [key: string]: string };
    changeFontSize: { [key: string]: string };
    flipArrow: { [key: string]: string };
    typePlaceholder: { [key: string]: string };
    small: { [key: string]: string };
    normal: { [key: string]: string };
    extraSmall: { [key: string]: string };
    large: { [key: string]: string };
  };
  poolNode: {
    addLaneNew: { [key: string]: string };
    unlockLane: { [key: string]: string };
    lockLane: { [key: string]: string };
    switchVertical: { [key: string]: string };
    switchHorizontal: { [key: string]: string };
    changeColor: { [key: string]: string };
    deleteLane: { [key: string]: string };
    dragResize: { [key: string]: string };
  };
  contextMenu: {
    resetColor: { [key: string]: string };
    changeColor: { [key: string]: string };
    delete: { [key: string]: string };
    changeType: { [key: string]: string };
    startType: { [key: string]: string };
    taskType: { [key: string]: string };
    gatewayType: { [key: string]: string };
    immediateType: { [key: string]: string };
    endType: { [key: string]: string };
    properties: { [key: string]: string };
    appearance: { [key: string]: string };
    borderStyle: { [key: string]: string };
    duplicate: { [key: string]: string };
    bezierCurved: { [key: string]: string };
    straight: { [key: string]: string };
    step: { [key: string]: string };
    solid: { [key: string]: string };
    dashed: { [key: string]: string };
    dotted: { [key: string]: string };
    double: { [key: string]: string };
    enable: { [key: string]: string };
    disable: { [key: string]: string };
    labelAtStart: { [key: string]: string };
    labelAtCenter: { [key: string]: string };
    labelAtEnd: { [key: string]: string };
    pathType: { [key: string]: string };
    pathStyle: { [key: string]: string };
    animation: { [key: string]: string };
    addLabel: { [key: string]: string };
    yellow: { [key: string]: string };
    blue: { [key: string]: string };
    green: { [key: string]: string };
    pink: { [key: string]: string };
    purple: { [key: string]: string };
    orange: { [key: string]: string };
    gray: { [key: string]: string };
  };
  validation: {
    workflowValidation: { [key: string]: string };
    error: { [key: string]: string };
    errors: { [key: string]: string };
    warning: { [key: string]: string };
    warnings: { [key: string]: string };
    node: { [key: string]: string };
    labelRequired: { [key: string]: string };
    nodeMustHaveId: { [key: string]: string };
    nodeMustHaveType: { [key: string]: string };
    isRequired: { [key: string]: string };
    validationFailed: { [key: string]: string };
    edgeMustHaveSource: { [key: string]: string };
    edgeMustHaveTarget: { [key: string]: string };
    connectionNotAllowed: { [key: string]: string };
    workflowValidationFailed: { [key: string]: string };
  };
  header: {
    save: { [key: string]: string };
  };
  undoRedo: {
    undo: { [key: string]: string };
    redo: { [key: string]: string };
  };
  shortcuts: {
    keyboardShortcuts: { [key: string]: string };
    close: { [key: string]: string };
  };
  layout: {
    verticalLayout: { [key: string]: string };
    horizontalLayout: { [key: string]: string };
  };
  output: {
    viewWorkflow: { [key: string]: string };
    workflowJson: { [key: string]: string };
    viewCopyWorkflow: { [key: string]: string };
    copyJson: { [key: string]: string };
  };
  theme: {
    lightMode: { [key: string]: string };
    darkMode: { [key: string]: string };
    systemMode: { [key: string]: string };
  };
  run: {
    cannotRunWorkflow: { [key: string]: string };
    workflowExecutionStarted: { [key: string]: string };
    run: { [key: string]: string };
  };
  import: {
    importWorkflow: { [key: string]: string };
  };
  export: {
    exportWorkflow: { [key: string]: string };
  };
  canvas: {
    cannotCreateConnection: { [key: string]: string };
    circularLoopError: { [key: string]: string };
  };
}

export const DEFAULT_UI_TRANSLATIONS: UITranslations = {
  toolbar: {
    selectTool: { en: "Select tool (V)", vi: "Công cụ chọn (V)" },
    handTool: {
      en: "Hand tool (H) - Pan canvas only",
      vi: "Công cụ cầm nắm (H) - Chỉ di chuyển canvas",
    },
    zoomOut: { en: "Zoom out", vi: "Thu nhỏ" },
    zoomIn: { en: "Zoom in", vi: "Phóng to" },
    resetView: { en: "Reset view", vi: "Đặt lại chế độ xem" },
    fullscreen: { en: "Fullscreen", vi: "Toàn màn hình" },
    moreOptions: { en: "More options", vi: "Thêm tùy chọn" },
    options: { en: "Options", vi: "Tùy chọn" },
    minimap: { en: "Minimap", vi: "Bản đồ thu nhỏ" },
  },
  toolbox: {
    expandToolbox: { en: "Expand toolbox", vi: "Mở rộng hộp công cụ" },
    minimizeToolbox: { en: "Minimize toolbox", vi: "Thu nhỏ hộp công cụ" },
    collapseToolbox: { en: "Collapse toolbox", vi: "Đóng hộp công cụ" },
    toolbox: { en: "Toolbox", vi: "Hộp công cụ" },
  },
  properties: {
    nodeProperties: { en: "Node Properties", vi: "Thuộc tính nút" },
    edgeProperties: { en: "Edge Properties", vi: "Thuộc tính cạnh" },
    noPropertiesAvailable: {
      en: "No properties available in this group",
      vi: "Không có thuộc tính nào trong nhóm này",
    },
    noPropertyGroupsAvailable: {
      en: "No property groups available",
      vi: "Không có nhóm thuộc tính nào",
    },
    selectNodeToConfigure: {
      en: "Select a node to configure",
      vi: "Chọn một nút để cấu hình",
    },
    noConfigurationAvailable: {
      en: "No configuration available for this node type",
      vi: "Không có cấu hình nào cho loại nút này",
    },
    selectEdgeToConfigure: {
      en: "Select an edge to configure",
      vi: "Chọn một cạnh để cấu hình",
    },
  },
  multiSelect: {
    enterValuesPlaceholder: {
      en: "Enter values (one per line)...",
      vi: "Nhập giá trị (một dòng một giá trị)...",
    },
  },
  noteNode: {
    changeColor: { en: "Change color", vi: "Đổi màu" },
    changeFontSize: { en: "Change font size", vi: "Đổi kích thước font" },
    typePlaceholder: {
      en: "Type your note here...",
      vi: "Nhập ghi chú của bạn ở đây...",
    },
    styledWithMarkdown: {
      en: "Styled with markdown",
      vi: "Được tạo kiểu bằng markdown",
    },
    small: { en: "Small", vi: "Nhỏ" },
    normal: { en: "Normal", vi: "Bình thường" },
    extraSmall: { en: "Extra Small", vi: "Rất nhỏ" },
    large: { en: "Large", vi: "Lớn" },
  },
  annotationNode: {
    changeTextColor: { en: "Change text color", vi: "Đổi màu chữ" },
    changeFontSize: { en: "Change font size", vi: "Đổi kích thước font" },
    flipArrow: { en: "Flip arrow", vi: "Lật mũi tên" },
    typePlaceholder: {
      en: "Type your annotation here...",
      vi: "Nhập chú thích của bạn ở đây...",
    },
    small: { en: "Small", vi: "Nhỏ" },
    normal: { en: "Normal", vi: "Bình thường" },
    extraSmall: { en: "Extra Small", vi: "Rất nhỏ" },
    large: { en: "Large", vi: "Lớn" },
  },
  poolNode: {
    addLaneNew: { en: "Add Lane", vi: "Thêm làn đường" },
    unlockLane: {
      en: "Unlock (allow dragging out)",
      vi: "Mở khóa (cho phép kéo ra)",
    },
    lockLane: {
      en: "Lock (keep nodes inside)",
      vi: "Khóa (giữ các nút bên trong)",
    },
    switchVertical: { en: "Switch to vertical", vi: "Chuyển sang dọc" },
    switchHorizontal: { en: "Switch to horizontal", vi: "Chuyển sang ngang" },
    changeColor: { en: "Change Color", vi: "Đổi màu" },
    deleteLane: { en: "Delete Lane", vi: "Xóa làn đường" },
    dragResize: { en: "Drag to resize", vi: "Kéo để thay đổi kích thước" },
  },
  contextMenu: {
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
  },
  validation: {
    workflowValidation: { en: "Workflow Validation", vi: "Xác thực quy trình" },
    error: { en: "error", vi: "lỗi" },
    errors: { en: "errors", vi: "lỗi" },
    warning: { en: "warning", vi: "cảnh báo" },
    warnings: { en: "warnings", vi: "cảnh báo" },
    node: { en: "Node:", vi: "Nút:" },
    labelRequired: { en: "Label is required", vi: "Nhãn là bắt buộc" },
    nodeMustHaveId: { en: "Node must have an id", vi: "Nút phải có một id" },
    nodeMustHaveType: {
      en: "Node must have a type",
      vi: "Nút phải có một loại",
    },
    isRequired: { en: "is required", vi: "là bắt buộc" },
    validationFailed: {
      en: "Validation failed",
      vi: "Xác thực không thành công",
    },
    edgeMustHaveSource: {
      en: "Edge must have a source",
      vi: "Cạnh phải có một nguồn",
    },
    edgeMustHaveTarget: {
      en: "Edge must have a target",
      vi: "Cạnh phải có một mục tiêu",
    },
    connectionNotAllowed: {
      en: "Connection not allowed",
      vi: "Không được phép kết nối",
    },
    workflowValidationFailed: {
      en: "Workflow validation failed",
      vi: "Xác thực quy trình không thành công",
    },
  },
  header: {
    save: { en: "Save", vi: "Lưu" },
  },
  undoRedo: {
    undo: { en: "Undo", vi: "Hoàn tác" },
    redo: { en: "Redo", vi: "Làm lại" },
  },
  shortcuts: {
    keyboardShortcuts: { en: "Keyboard Shortcuts", vi: "Phím tắt bàn phím" },
    close: { en: "Close", vi: "Đóng" },
  },
  layout: {
    verticalLayout: {
      en: "Vertical Layout (Top to Bottom)",
      vi: "Bố cục dọc (Trên xuống dưới)",
    },
    horizontalLayout: {
      en: "Horizontal Layout (Left to Right)",
      vi: "Bố cục ngang (Trái qua phải)",
    },
  },
  output: {
    viewWorkflow: { en: "View Workflow", vi: "Xem quy trình" },
    workflowJson: { en: "Workflow JSON", vi: "JSON quy trình" },
    viewCopyWorkflow: {
      en: "View and copy the workflow configuration as JSON",
      vi: "Xem và sao chép cấu hình quy trình dưới dạng JSON",
    },
    copyJson: { en: "Copy JSON", vi: "Sao chép JSON" },
  },
  theme: {
    lightMode: { en: "Light Mode", vi: "Chế độ sáng" },
    darkMode: { en: "Dark Mode", vi: "Chế độ tối" },
    systemMode: { en: "System Mode", vi: "Chế độ hệ thống" },
  },
  run: {
    cannotRunWorkflow: {
      en: "Cannot run workflow. Please fix {count} error(s).",
      vi: "Không thể chạy quy trình. Vui lòng sửa {count} lỗi.",
    },
    workflowExecutionStarted: {
      en: "Workflow execution started!",
      vi: "Bắt đầu thực thi quy trình!",
    },
    run: { en: "Run", vi: "Chạy" },
  },
  import: {
    importWorkflow: { en: "Import Workflow", vi: "Nhập quy trình" },
  },
  export: {
    exportWorkflow: { en: "Export Workflow", vi: "Xuất quy trình" },
  },
  canvas: {
    cannotCreateConnection: {
      en: "Cannot create connection: {message}",
      vi: "Không thể tạo kết nối: {message}",
    },
    circularLoopError: {
      en: "❌ Cannot create connection: This would create a circular loop in the workflow!",
      vi: "❌ Không thể tạo kết nối: Điều này sẽ tạo một vòng lặp trong quy trình!",
    },
  },
};
