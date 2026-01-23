import { useWorkflowStore } from "@/core/store/workflowStore";
import { Play, Square, SkipForward, Variable } from "lucide-react";
import { cn } from "@sth87/shadcn-design-system";

export function SimulationControls() {
  const {
    simulation,
    startSimulation,
    stopSimulation,
    stepSimulation
  } = useWorkflowStore();

  if (!simulation.active) {
    return (
      <button
        onClick={() => startSimulation()}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
        title="Start Process Simulation"
      >
        <Play size={14} fill="currentColor" />
        Simulate
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700 shadow-xl animate-in fade-in zoom-in duration-200">
      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-400 border-r border-slate-700 mr-1">
        Live
      </div>

      <button
        onClick={stepSimulation}
        disabled={!simulation.currentNodeId}
        className={cn(
          "p-2 rounded hover:bg-slate-800 text-slate-300 transition-colors",
          !simulation.currentNodeId && "opacity-50 cursor-not-allowed"
        )}
        title="Next Step"
      >
        <SkipForward size={16} />
      </button>

      <button
        onClick={stopSimulation}
        className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
        title="Stop Simulation"
      >
        <Square size={16} fill="currentColor" />
      </button>

      <div className="mx-1 h-4 w-px bg-slate-700" />

      <div className="flex items-center gap-2 px-2 text-xs text-slate-400 font-mono">
        <Variable size={12} />
        <span>{Object.keys(simulation.variables).length} vars</span>
      </div>
    </div>
  );
}
