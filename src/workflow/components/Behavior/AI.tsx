import { Button } from "@sth87/shadcn-design-system";
import { Sparkles } from "lucide-react";
import React, { useState } from "react";
import { AIGeneratorModal } from "../AI/AIGeneratorModal";

interface AIWorkflowProps {
  className?: string;
  onGenerate?: (data: any) => void;
  apiKey?: string;
  defaultProvider?: "openai" | "gemini";
  disabled?: boolean;
}

const AIWorkflow = ({
  className,
  onGenerate,
  apiKey,
  defaultProvider,
  disabled,
}: AIWorkflowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // You can inject initial config if needed via props or context
  // For now, AIGeneratorModal manages its own state via localStorage
  // but we could pass props down if we want controlled mode.

  return (
    <div className={className}>
      <Button
        title="AI Generator"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 hover:bg-muted text-purple-600 dark:text-purple-400"
      >
        <Sparkles size={16} />
        <span>AI Assistant</span>
      </Button>

      {isOpen && (
        <AIGeneratorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export { AIWorkflow };
