# Hướng Dẫn Cấu Hình JSON cho BPM Workflow

Hướng dẫn này giải thích cách cấu hình nodes, edges và properties trong thư viện workflow này. Hệ thống được thiết kế để có tính động cao, cho phép bạn định nghĩa các hành vi và giao diện mới hoàn toàn thông qua cấu hình.

## Mục Lục

1. [Cấu Hình Node](#cấu-hình-node)
2. [Hệ Thống Kế Thừa](#hệ-thống-kế-thừa)
3. [Định Nghĩa Properties](#định-nghĩa-properties)
4. [Hiển Thị Có Điều Kiện](#hiển-thị-có-điều-kiện)
5. [Đa Ngôn Ngữ](#đa-ngôn-ngữ)

---

## Cấu Hình Node

Một node được định nghĩa bởi `NodeType` và một object cấu hình.

```typescript
{
  id: "my-custom-node",
  type: "custom-node",
  name: "My Custom Node",
  extends: "base-node", // Tùy chọn: Kế thừa từ node khác
  config: {
    category: "task",
    metadata: {
      title: "Tiêu Đề Node Của Tôi",
      description: "Mô tả về chức năng của node này"
    },
    icon: {
      type: "lucide",
      value: "Activity", // Tên icon Lucide hoặc component
      backgroundColor: "#3b82f6",
      color: "#ffffff"
    },
    propertyDefinitions: [
      // ... định nghĩa các trường
    ]
  }
}
```

## Hệ Thống Kế Thừa

Thuộc tính `extends` cho phép bạn tạo các node chuyên biệt dựa trên node đã có.

- **Deep Merging**: Hệ thống gộp `propertyDefinitions`, `visualConfig`, và `metadata`.
- **Ghi Đè**: Các thuộc tính định nghĩa trong node con sẽ ghi đè lên node cha.
- **Ví Dụ**: `Timer Start Event` kế thừa từ `Start Event`. Nó kế thừa icon hình tròn màu xanh lá nhưng thêm các trường đặc biệt cho timer.

## Định Nghĩa Properties

Mỗi trường trong Properties Panel được định nghĩa trong mảng `propertyDefinitions`.

| Thuộc Tính     | Kiểu        | Mô Tả                                                                                                    |
| :------------- | :---------- | :------------------------------------------------------------------------------------------------------- |
| `id`           | `string`    | ID duy nhất của trường (dùng để lưu trữ dữ liệu).                                                        |
| `type`         | `string`    | Component giao diện: `text`, `number`, `select`, `multiselect`, `switch`, `date`, `logic`, `expression`. |
| `label`        | `string`    | Khóa dịch hoặc chuỗi tĩnh.                                                                               |
| `group`        | `string`    | Nhóm trong giao diện: `basic`, `config`, `advanced`, `appearance`.                                       |
| `defaultValue` | `any`       | Giá trị khởi tạo.                                                                                        |
| `options`      | `array`     | Cho `select` hoặc `multiselect` (ví dụ: `[{label: 'A', value: 'a'}]`).                                   |
| `validation`   | `ZodSchema` | Schema Zod tùy chọn để validation.                                                                       |

### Các Kiểu Trường Đặc Biệt

- **`logic`**: Textarea với font monospace cho logic boolean.
- **`expression`**: Textarea với font monospace cho biến đổi dữ liệu.

## Hiển Thị Có Điều Kiện

Bạn có thể ẩn hoặc hiện các trường dựa trên giá trị của các trường khác bằng thuộc tính `visible`.

### Điều Kiện Đơn Giản

```json
"visible": { "field": "timerType", "operator": "equals", "value": "once" }
```

### Các Toán Tử Nâng Cao

- `equals` / `===`
- `notEquals` / `!==`
- `includes` / `contains`
- `regex` (value là chuỗi pattern)
- `in` / `notIn` (value là một mảng)

### Toán Tử Logic (AND/OR)

```json
"visible": {
  "or": [
    { "field": "status", "operator": "equals", "value": "active" },
    { "field": "type", "operator": "in", "value": ["admin", "super"] }
  ]
}
```

## Đa Ngôn Ngữ

Luôn sử dụng khóa dịch (translation keys) cho labels và descriptions.

- Các khóa bắt đầu bằng `ui.` là các phần tử giao diện chung.
- Các khóa bắt đầu bằng `plugin.default.` đặc biệt cho BPM plugin.
- Các khóa mới nên được thêm vào `src/translations/plugins.vi.json` và `src/translations/plugins.en.json`.

Ví dụ:

```json
"label": "ui.properties.timerType"
```
