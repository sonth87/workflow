/**
 * Custom Node Components
 * Demo components cho custom plugin nodes
 */


import { Handle, Position } from "@xyflow/react";
import { Sparkles, Database, Globe, CheckCircle2 } from "lucide-react";

interface CustomNodeProps {
  data: {
    label?: string;
    [key: string]: unknown;
  };
  id: string;
}

/**
 * AI Assistant Node
 */
export function AIAssistantNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-purple-500 bg-purple-50 min-w-[180px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-purple-600" />
        <div>
          <div className="font-semibold text-sm text-purple-900">
            {data.label || "AI Assistant"}
          </div>
          <div className="text-xs text-purple-600">
            AI-powered automation
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}

/**
 * Data Processor Node
 */
export function DataProcessorNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-blue-500 bg-blue-50 min-w-[180px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <Database size={20} className="text-blue-600" />
        <div>
          <div className="font-semibold text-sm text-blue-900">
            {data.label || "Data Processor"}
          </div>
          <div className="text-xs text-blue-600">
            Transform & process data
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}

/**
 * API Integrator Node
 */
export function APIIntegratorNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50 min-w-[180px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <Globe size={20} className="text-green-600" />
        <div>
          <div className="font-semibold text-sm text-green-900">
            {data.label || "API Integrator"}
          </div>
          <div className="text-xs text-green-600">
            External API integration
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}

/**
 * Custom Validator Node
 */
export function CustomValidatorNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-orange-500 bg-orange-50 min-w-[180px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <CheckCircle2 size={20} className="text-orange-600" />
        <div>
          <div className="font-semibold text-sm text-orange-900">
            {data.label || "Custom Validator"}
          </div>
          <div className="text-xs text-orange-600">
            Custom validation logic
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}

/**
 * Export all custom node components
 */
export const customNodeComponents = {
  aiAssistant: AIAssistantNode,
  dataProcessor: DataProcessorNode,
  apiIntegrator: APIIntegratorNode,
  customValidator: CustomValidatorNode,
};
