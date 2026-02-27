# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BPM Core is a flexible and modular workflow builder library for Business Process Management (BPM), developed with React and ReactFlow. The library provides an intuitive drag-and-drop interface for creating, editing, and managing complex workflows with support for custom nodes, edges, validation rules, and plugins.

Key features:
- **Dual Integration Modes**: NPM Library (full React customization) and SDK Script (simple vanilla JS integration)
- **Dynamic Plugin System**: Extensible architecture for custom nodes, edges, rules, and themes
- **AI Integration Ready**: Built-in support for LLM-powered workflow generation (OpenAI, Gemini)
- **Internationalization**: Supports both nested and flat translation formats
- **Visual Configuration**: Dynamic styling system for nodes and edges
- **Workflow Simulation**: Built-in simulator for testing workflow logic before deployment

## Architecture

### Three-Layer Architecture

#### 1. Application Layer
- **Toolbox (Sidebar)**: Component displaying available nodes for drag-and-drop
- **Main Canvas (ReactFlow)**: Primary area for building workflows with zoom, pan, selection
- **Properties Panel**: Right panel for configuring selected node/edge properties
- **Validation Panel**: Real-time validation feedback

#### 2. Core Business Layer (`src/core/`)
- **Workflow Engine Core**: Main workflow processing logic
  - State Management (Zustand): Global state management in `store/`
  - Event Bus System: Inter-component communication in `events/`
  - Validation Engine: Dynamic validation with extensible rules in `validation/`
- **Factory System**: Node and edge creation in `factory/`
- **Services**: Core services in `services/`

#### 3. Registry and Configuration Layer (`src/core/registry/`)
- **NodeRegistry**: Manages node types and configurations
- **EdgeRegistry**: Manages edge types
- **RuleRegistry**: Manages validation and business rules
- **ThemeRegistry**: Manages themes and color palettes
- **ContextMenuRegistry**: Manages context menus

### Plugin System (`src/plugins/`)
Plugins can register:
- Custom nodes with React components
- Custom edges
- Custom validation rules
- Custom themes and color palettes
- Event subscriptions

Example plugins:
- `default-bpm/`: Default BPMN nodes (start, end, tasks, gateways)
- `customPlugin.ts`: Custom plugin template
- `aiMLPlugin.ts`: AI/ML workflow nodes

### Build Outputs

Two build modes are supported:

| Feature | SDK Build (`build:sdk`) | Library Build (`build:lib`) |
|---------|-------------------------|------------------------------|
| **Output** | `sdk-dist/` | `lib-dist/` |
| **Format** | IIFE (single file) | ESM + CJS |
| **Use Case** | Vanilla JS, CDN, HTML | React projects |
| **TypeScript** | Limited | Full support (136+ .d.ts) |
| **Tree Shaking** | ❌ | ✅ |

## Key Implementation Notes

### Workflow State Structure
Workflows are represented as JSON with `nodes` and `edges` arrays:
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

### Node Configuration
Nodes are defined with extensive configuration:
- `metadata`: ID, title, description, version, tags
- `icon`: Lucide icon name with background/foreground colors
- `propertyDefinitions`: Dynamic form fields with visibility conditions
- `visualConfig`: Styling (colors, borders, shadows)
- `behavior`: Collapsible, editable, deletable, draggable flags

### Translation System
Two formats supported:
- **Nested Format**: All languages embedded in config (small projects)
- **Flat Format**: Separate translation files per language (recommended for large projects)

### AI Integration
The system supports LLM-powered workflow generation:
1. Context Loading: Fetch Capabilities Schema via `getRegistryCapabilities()`
2. LLM Generation: Send system prompt + user prompt
3. Validation: `validateGeneratedWorkflow()` checks node types and connections
4. State Update: Apply to workflow store

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:5173)
pnpm build                  # Build application

# Library build (for npm publish)
pnpm build:lib              # Output: lib-dist/

# SDK build (for CDN/vanilla JS)
pnpm build:sdk              # Output: sdk-dist/

# Code quality
pnpm lint                   # ESLint check
pnpm format                 # Prettier formatting

# Preview builds
pnpm preview                # Preview main build
pnpm preview:sdk            # Preview SDK build
```

## Development Rules

### General
- Update existing documentation in `./readme/` directory before any code refactoring
- Add new documentation to `./readme/` after implementing new features (avoid duplicates)
- Keep feature documentation aligned with implementation

### Code Organization
```
src/
├── core/           # Core engine, registries, store, validation
├── plugins/        # Plugin definitions (default-bpm, custom)
├── workflow/       # React components (Canvas, Toolbox, PropertiesPanel)
├── translations/   # i18n translation files
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Adding Custom Nodes
1. Define node config in a plugin file (`src/plugins/`)
2. Create React component if custom rendering needed (`src/workflow/components/nodes/`)
3. Register via PluginManager
4. Add translations if using i18n

### Adding Custom Validation Rules
1. Create rule in `src/core/validation/`
2. Register via RuleRegistry
3. Associate with node types in plugin config

### Code Quality Guidelines
- Prioritize functionality and readability over strict style enforcement
- Use reasonable code quality standards that enhance developer productivity
- Follow existing patterns in the codebase

### Pre-commit/Push Rules
- Run `pnpm lint` before commit
- Run `pnpm format` before commit to ensure consistent formatting
- Keep commits focused on actual code changes
- **DO NOT** commit confidential information (API keys, credentials, etc.)
- NEVER automatically add AI attribution signatures
- Create clean, professional commit messages using conventional commit format

### Testing Approach
When implementing tests:
- Unit tests for core services (store, validation, registries)
- Integration tests for plugin system
- Component tests for workflow UI elements
- Mock LLM responses for AI service tests

## File Naming Conventions

- React components: `PascalCase.tsx` (e.g., `PropertiesPanel.tsx`)
- Utilities/services: `camelCase.ts` (e.g., `workflowStore.ts`)
- Types: `*.type.ts` or `*.types.ts`
- Constants: `*.constants.ts`
- Documentation: `UPPER_CASE.md` in `readme/`
