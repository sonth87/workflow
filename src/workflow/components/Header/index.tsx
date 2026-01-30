/**
 * Workflow Header Component
 * Giống với header của workflow cũ
 */

import { useWorkflowStore } from "@/core/store/workflowStore";
import { useWorkflowEvents } from "@/workflow/hooks/useWorkflow";
import { Save, Sparkles } from "lucide-react";
import { useState } from "react";
import { AIGeneratorModal } from "../AI/AIGeneratorModal";
import {
  ExportWorkflow,
  ImportWorkflow,
  Shortcuts,
  LayoutSwitcher,
  OutputViewer,
  ThemeSwitcher,
  ViewModeSwitcher,
  SimulationControls,
} from "../Behavior";
import { LanguageSwitcher } from "../LanguageSwitcher";

export type LayoutDirection = "vertical" | "horizontal";

interface HeaderProps {
  onSave?: () => void;
}

export function Header({ onSave }: HeaderProps) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
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
        <div className="flex items-center gap-3">
          <SimulationControls />
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
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
            title="AI Agent"
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 rounded bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-white hover:from-violet-700 hover:to-indigo-700 shadow-sm transition-all"
          >
            <Sparkles size={16} />
            AI Agent
          </button>

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

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </header>
  );
}
