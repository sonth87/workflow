import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Settings } from "lucide-react";
import { AIService } from "../../../core/services/AIService";
import { useWorkflowStore } from "../../../core/store/workflowStore";

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
    const storedKey = localStorage.getItem("bpm_ai_api_key");
    const storedProvider = localStorage.getItem("bpm_ai_provider");
    if (storedKey) setApiKey(storedKey);
    if (storedProvider) setProvider(storedProvider as "openai" | "gemini");
  }, []);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    localStorage.setItem("bpm_ai_api_key", apiKey);
    localStorage.setItem("bpm_ai_provider", provider);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Sparkles size={18} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Workflow Generator
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {showSettings ? (
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
              AI Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI (GPT-4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API Key"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Keys are stored locally in your browser.
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900"
              >
                Save Settings
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Describe the workflow you want to create (e.g., "A leave request process with approval").
            </p>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              placeholder="Enter your prompt here..."
              autoFocus
            />

            {error && (
              <div className="mt-3 text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
        )}

        {!showSettings && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
