# CLAUDE.md

File này cung cấp hướng dẫn cho Claude Code (claude.ai/code) khi làm việc với code trong repository này.

## Tổng Quan Dự Án

BPM Core là thư viện xây dựng workflow linh hoạt và modular cho Business Process Management (BPM), được phát triển với React và ReactFlow. Thư viện cung cấp giao diện kéo-thả trực quan để tạo, chỉnh sửa và quản lý các workflow phức tạp với hỗ trợ custom nodes, edges, validation rules và plugins.

Các tính năng chính:
- **Hai Chế Độ Tích Hợp**: NPM Library (tùy biến React đầy đủ) và SDK Script (tích hợp vanilla JS đơn giản)
- **Hệ Thống Plugin Động**: Kiến trúc mở rộng cho custom nodes, edges, rules và themes
- **Sẵn Sàng Tích Hợp AI**: Hỗ trợ tích hợp sẵn cho việc sinh workflow bằng LLM (OpenAI, Gemini)
- **Đa Ngôn Ngữ**: Hỗ trợ cả định dạng dịch thuật nested và flat
- **Cấu Hình Giao Diện**: Hệ thống styling động cho nodes và edges
- **Mô Phỏng Workflow**: Có sẵn công cụ mô phỏng để kiểm tra logic workflow trước khi triển khai

## Kiến Trúc

### Kiến Trúc Ba Lớp

#### 1. Application Layer (Lớp Ứng Dụng)
- **Toolbox (Sidebar)**: Component hiển thị các node có sẵn để kéo-thả
- **Main Canvas (ReactFlow)**: Khu vực chính để xây dựng workflow với zoom, pan, selection
- **Properties Panel**: Panel bên phải để cấu hình properties của node/edge được chọn
- **Validation Panel**: Phản hồi validation theo thời gian thực

#### 2. Core Business Layer (Lớp Logic Nghiệp Vụ) (`src/core/`)
- **Workflow Engine Core**: Logic xử lý workflow chính
  - State Management (Zustand): Quản lý state toàn cục trong `store/`
  - Event Bus System: Giao tiếp giữa các component trong `events/`
  - Validation Engine: Validation động với rules mở rộng trong `validation/`
- **Factory System**: Tạo node và edge trong `factory/`
- **Services**: Các dịch vụ core trong `services/`

#### 3. Registry and Configuration Layer (Lớp Registry và Cấu Hình) (`src/core/registry/`)
- **NodeRegistry**: Quản lý các loại node và cấu hình
- **EdgeRegistry**: Quản lý các loại edge
- **RuleRegistry**: Quản lý validation và business rules
- **ThemeRegistry**: Quản lý themes và color palettes
- **ContextMenuRegistry**: Quản lý context menus

### Hệ Thống Plugin (`src/plugins/`)
Plugins có thể đăng ký:
- Custom nodes với React components
- Custom edges
- Custom validation rules
- Custom themes và color palettes
- Event subscriptions

Các plugins mẫu:
- `default-bpm/`: Các node BPMN mặc định (start, end, tasks, gateways)
- `customPlugin.ts`: Template custom plugin
- `aiMLPlugin.ts`: Các node workflow AI/ML

### Build Outputs

Hai chế độ build được hỗ trợ:

| Tính Năng | SDK Build (`build:sdk`) | Library Build (`build:lib`) |
|-----------|-------------------------|------------------------------|
| **Output** | `sdk-dist/` | `lib-dist/` |
| **Format** | IIFE (single file) | ESM + CJS |
| **Use Case** | Vanilla JS, CDN, HTML | React projects |
| **TypeScript** | Hạn chế | Hỗ trợ đầy đủ (136+ .d.ts) |
| **Tree Shaking** | ❌ | ✅ |

## Ghi Chú Triển Khai Quan Trọng

### Cấu Trúc Workflow State
Workflows được biểu diễn dưới dạng JSON với mảng `nodes` và `edges`:
```json
{
  "nodes": [
    { "id": "node_1", "type": "start-event", "position": { "x": 0, "y": 0 }, "data": {}, "properties": {} }
  ],
  "edges": [
    { "id": "edge_1", "source": "node_1", "target": "node_2", "type": "sequence-flow" }
  ]
}
```

### Cấu Hình Node
Nodes được định nghĩa với cấu hình mở rộng:
- `metadata`: ID, title, description, version, tags
- `icon`: Tên icon Lucide với màu background/foreground
- `propertyDefinitions`: Các trường form động với điều kiện hiển thị
- `visualConfig`: Styling (màu sắc, borders, shadows)
- `behavior`: Các cờ collapsible, editable, deletable, draggable

### Hệ Thống Dịch Thuật
Hai định dạng được hỗ trợ:
- **Nested Format**: Tất cả ngôn ngữ được nhúng trong config (dự án nhỏ)
- **Flat Format**: File dịch riêng cho mỗi ngôn ngữ (khuyến nghị cho dự án lớn)

### Tích Hợp AI
Hệ thống hỗ trợ sinh workflow bằng LLM:
1. Context Loading: Lấy Capabilities Schema qua `getRegistryCapabilities()`
2. LLM Generation: Gửi system prompt + user prompt
3. Validation: `validateGeneratedWorkflow()` kiểm tra node types và connections
4. State Update: Áp dụng vào workflow store

## Các Lệnh Thường Dùng

```bash
# Development
pnpm dev                    # Khởi động dev server (http://localhost:5173)
pnpm build                  # Build ứng dụng

# Library build (để publish npm)
pnpm build:lib              # Output: lib-dist/

# SDK build (cho CDN/vanilla JS)
pnpm build:sdk              # Output: sdk-dist/

# Chất lượng code
pnpm lint                   # Kiểm tra ESLint
pnpm format                 # Format code với Prettier

# Preview builds
pnpm preview                # Preview main build
pnpm preview:sdk            # Preview SDK build
```

## Quy Tắc Phát Triển

### Tổng Quát
- Cập nhật tài liệu hiện có trong thư mục `./readme/` trước khi refactor code
- Thêm tài liệu mới vào `./readme/` sau khi triển khai tính năng mới (tránh trùng lặp)
- Giữ tài liệu tính năng đồng bộ với implementation

### Tổ Chức Code
```
src/
├── core/           # Core engine, registries, store, validation
├── plugins/        # Định nghĩa plugin (default-bpm, custom)
├── workflow/       # React components (Canvas, Toolbox, PropertiesPanel)
├── translations/   # File dịch i18n
├── types/          # Định nghĩa TypeScript types
└── utils/          # Các hàm tiện ích
```

### Thêm Custom Nodes
1. Định nghĩa node config trong file plugin (`src/plugins/`)
2. Tạo React component nếu cần render custom (`src/workflow/components/nodes/`)
3. Đăng ký qua PluginManager
4. Thêm translations nếu sử dụng i18n

### Thêm Custom Validation Rules
1. Tạo rule trong `src/core/validation/`
2. Đăng ký qua RuleRegistry
3. Liên kết với node types trong plugin config

### Quy Tắc Chất Lượng Code
- Ưu tiên tính năng và khả năng đọc hơn việc tuân thủ style quá nghiêm ngặt
- Sử dụng tiêu chuẩn chất lượng code hợp lý để nâng cao năng suất developer
- Tuân theo các pattern hiện có trong codebase

### Quy Tắc Trước Commit/Push
- Chạy `pnpm lint` trước khi commit
- Chạy `pnpm format` trước khi commit để đảm bảo format nhất quán
- Giữ commits tập trung vào các thay đổi code thực tế
- **KHÔNG** commit thông tin bảo mật (API keys, credentials, v.v.)
- KHÔNG BAO GIỜ tự động thêm chữ ký AI attribution
- Tạo commit messages chuyên nghiệp, sạch sẽ sử dụng định dạng conventional commit

### Phương Pháp Testing
Khi triển khai tests:
- Unit tests cho core services (store, validation, registries)
- Integration tests cho plugin system
- Component tests cho các UI elements của workflow
- Mock LLM responses cho AI service tests

## Quy Ước Đặt Tên File

- React components: `PascalCase.tsx` (ví dụ: `PropertiesPanel.tsx`)
- Utilities/services: `camelCase.ts` (ví dụ: `workflowStore.ts`)
- Types: `*.type.ts` hoặc `*.types.ts`
- Constants: `*.constants.ts`
- Tài liệu: `UPPER_CASE.md` trong `readme/`
