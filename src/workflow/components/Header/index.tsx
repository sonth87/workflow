/**
 * Workflow Header Component
 * Giống với header của workflow cũ
 */

import { useWorkflowStore } from "@/core/store/workflowStore";
import { useWorkflowEvents } from "@/workflow/hooks/useWorkflow";
import { Save } from "lucide-react";
import {
  ExportWorkflow,
  ImportWorkflow,
  Shortcuts,
  LayoutSwitcher,
  OutputViewer,
  ThemeSwitcher,
  ViewModeSwitcher,
} from "../Behavior";

export type LayoutDirection = "vertical" | "horizontal";

interface HeaderProps {
  onSave?: () => void;
}

export function Header({ onSave }: HeaderProps) {
  const { workflowName, setWorkflowName } = useWorkflowStore();

  useWorkflowEvents("node:added", event => {
    console.log("Node được thêm:", event.payload);
  });

  useWorkflowEvents("edge:added", event => {
    console.log("Edge connected:", event.payload);
  });

  return (
    <header className="w-full bg-primaryA-100 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"></div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Shortcuts />

          <div className="mx-1 h-6 w-px bg-border" />

          {/* <LayoutSwitcher /> */}

          {/* <div className="mx-1 h-6 w-px bg-border" /> */}

          {/* Compact View Toggle */}
          <ViewModeSwitcher />

          <div className="mx-1 h-6 w-px bg-border" />

          <OutputViewer />
          <ImportWorkflow />

          <ExportWorkflow />

          <div className="mx-1 h-6 w-px bg-border" />

          <button
            title="Save"
            onClick={onSave}
            className="flex items-center gap-2 rounded bg-primary px-3 py-2 text-primary-foreground hover:opacity-90"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </header>
  );
}
