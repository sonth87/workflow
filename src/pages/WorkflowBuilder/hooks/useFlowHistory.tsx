import {
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback, useEffect, useRef } from "react";

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

interface UseFlowHistoryOptions {
  maxHistoryLength?: number; // Maximum number of history states to keep
  debounceMs?: number; // Debounce time for batching rapid changes
}

interface UseFlowHistoryReturn {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentIndex: number;
}

const DEFAULT_MAX_HISTORY = 50;
const DEFAULT_DEBOUNCE_MS = 300;

export function useFlowHistory(
  initialNodes: Node[],
  initialEdges: Edge[],
  options: UseFlowHistoryOptions = {}
): UseFlowHistoryReturn {
  const {
    maxHistoryLength = DEFAULT_MAX_HISTORY,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options;

  const [nodes, setNodesState] = useNodesState<Node>(initialNodes);
  const [edges, setEdgesState] = useEdgesState<Edge>(initialEdges);

  const historyRef = useRef<HistoryState[]>([
    { nodes: initialNodes, edges: initialEdges, timestamp: Date.now() },
  ]);
  const pointerRef = useRef(0);
  const isUndoRedoRef = useRef(false);
  const pendingChangeRef = useRef<{ nodes: Node[]; edges: Edge[] } | null>(
    null
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const forceUpdate = useCallback(() => {
    setNodesState(n => [...n]);
  }, [setNodesState]);

  const commitToHistory = useCallback(() => {
    if (!pendingChangeRef.current || isUndoRedoRef.current) return;

    const { nodes: newNodes, edges: newEdges } = pendingChangeRef.current;
    const history = historyRef.current;
    const pointer = pointerRef.current;

    const currentState = history[pointer];
    const nodesChanged =
      JSON.stringify(
        newNodes.map(n => ({ id: n.id, position: n.position, data: n.data }))
      ) !==
      JSON.stringify(
        currentState.nodes.map(n => ({
          id: n.id,
          position: n.position,
          data: n.data,
        }))
      );
    const edgesChanged =
      JSON.stringify(
        newEdges.map(e => ({ id: e.id, source: e.source, target: e.target }))
      ) !==
      JSON.stringify(
        currentState.edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
        }))
      );

    if (!nodesChanged && !edgesChanged) {
      pendingChangeRef.current = null;
      return;
    }

    const sliced = history.slice(0, pointer + 1);

    const newState: HistoryState = {
      nodes: newNodes,
      edges: newEdges,
      timestamp: Date.now(),
    };

    let newHistory = [...sliced, newState];
    if (newHistory.length > maxHistoryLength) {
      newHistory = newHistory.slice(newHistory.length - maxHistoryLength);
    }

    historyRef.current = newHistory;
    pointerRef.current = newHistory.length - 1;
    pendingChangeRef.current = null;
  }, [maxHistoryLength]);

  const scheduleCommit = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      if (isUndoRedoRef.current) return;

      pendingChangeRef.current = { nodes: newNodes, edges: newEdges };

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        commitToHistory();
        debounceTimerRef.current = null;
      }, debounceMs);
    },
    [commitToHistory, debounceMs]
  );

  const setNodes: React.Dispatch<React.SetStateAction<Node[]>> = useCallback(
    updater => {
      setNodesState(prev => {
        const updated = typeof updater === "function" ? updater(prev) : updater;
        if (!isUndoRedoRef.current) {
          scheduleCommit(updated, edges);
        }
        return updated;
      });
    },
    [edges, scheduleCommit, setNodesState]
  );

  const setEdges: React.Dispatch<React.SetStateAction<Edge[]>> = useCallback(
    updater => {
      setEdgesState(prev => {
        const updated = typeof updater === "function" ? updater(prev) : updater;
        if (!isUndoRedoRef.current) {
          scheduleCommit(nodes, updated);
        }
        return updated;
      });
    },
    [nodes, scheduleCommit, setEdgesState]
  );

  const undo = useCallback(() => {
    if (pendingChangeRef.current) {
      commitToHistory();
    }

    if (pointerRef.current <= 0) return;

    isUndoRedoRef.current = true;

    const newPointer = pointerRef.current - 1;
    const state = historyRef.current[newPointer];

    setNodesState(state.nodes);
    setEdgesState(state.edges);
    pointerRef.current = newPointer;

    requestAnimationFrame(() => {
      isUndoRedoRef.current = false;
      forceUpdate();
    });
  }, [commitToHistory, forceUpdate, setEdgesState, setNodesState]);

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;

    isUndoRedoRef.current = true;

    const newPointer = pointerRef.current + 1;
    const state = historyRef.current[newPointer];

    setNodesState(state.nodes);
    setEdgesState(state.edges);
    pointerRef.current = newPointer;

    requestAnimationFrame(() => {
      isUndoRedoRef.current = false;
      forceUpdate();
    });
  }, [forceUpdate, setEdgesState, setNodesState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (modifier && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    undo,
    redo,
    canUndo: pointerRef.current > 0,
    canRedo: pointerRef.current < historyRef.current.length - 1,
    historyLength: historyRef.current.length,
    currentIndex: pointerRef.current,
  };
}
