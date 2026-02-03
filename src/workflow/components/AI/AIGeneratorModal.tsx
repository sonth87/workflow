import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Settings } from "lucide-react";
import { AIService } from "../../../core/services/AIService";
import { useWorkflowStore } from "../../../core/store/workflowStore";
import { getNestedSetting, setNestedSetting } from "@/utils/storage";
import {
  Button,
  Dialog,
  Input,
  Select,
  Textarea,
} from "@sth87/shadcn-design-system";

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");

  const { setNodes, setEdges } = useWorkflowStore();

  useEffect(() => {
    // Load settings from local storage
    const storedKey = getNestedSetting<string>("ai.apiKey");
    const storedProvider = getNestedSetting<string>("ai.provider");
    if (storedKey) setApiKey(storedKey);
    if (storedProvider) setProvider(storedProvider as "openai" | "gemini");
  }, []);

  const handleSaveSettings = () => {
    setNestedSetting("ai.apiKey", apiKey);
    setNestedSetting("ai.provider", provider);
    setShowSettings(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!apiKey) {
      setShowSettings(true);
      setError("Please configure your API Key first.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Configure service
      AIService.configure({ apiKey, provider });

      const { nodes, edges } = await AIService.generateWorkflow(prompt);
      setNodes(nodes);
      setEdges(edges);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to generate workflow.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => !open && onClose()}
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Sparkles size={18} />
          </div>
          <span>AI Workflow Generator</span>
        </div>
      }
      size="2xl"
    >
      <div className="relative">
        {/* Settings Toggle - Absolute positioned like in a header if possible, or just top right of body */}
        <div className="absolute -top-12 right-0">
          {/* Note: positioning relative to title might be hard without access to Header. 
                 If title prop supports ReactNode, I put the Icon there. 
                 The Settings button should probably just be in the content area top-right or part of title if I can flex it.
             */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-muted-foreground hover:text-foreground"
            title="Settings"
          >
            <Settings size={14} />
          </Button>
        </div>

        <div className="py-2">
          {showSettings ? (
            <div className="space-y-4 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">AI Configuration</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <Select
                  label="Provider"
                  value={provider}
                  onChange={val => setProvider(val as "openai" | "gemini")}
                  options={[
                    { label: "Google Gemini", value: "gemini" },
                    { label: "OpenAI (GPT-4)", value: "openai" },
                  ]}
                />

                <div className="space-y-1">
                  <Input
                    label="API Key"
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Enter your API Key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Keys are stored locally in your browser.
                  </p>
                </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  Save Settings
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Describe the workflow you want to create (e.g., "A leave request
                process with approval").
              </p>

              <Textarea
                value={prompt}
                onChange={(e: any) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="min-h-[120px]"
                autoFocus
              />

              {error && (
                <div className="text-sm text-destructive font-medium">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {!showSettings && (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};
