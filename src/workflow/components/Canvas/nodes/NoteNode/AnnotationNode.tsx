import { useState, useCallback, useEffect, useRef } from "react";
import {
  type NodeProps,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { Palette, Type, RotateCcw } from "lucide-react";
import { cn, Popover } from "@sth87/shadcn-design-system";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { globalEventBus } from "@/core/events/EventBus";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import "./note.css";
import NodeResizer from "../../resizer";

const defaultContent = `**Double click** to edit me.`;

const textColorClasses = {
  black: "!text-black",
  white: "!text-white",
  red: "!text-red-500",
  blue: "!text-blue-500",
  green: "!text-green-500",
  yellow: "!text-yellow-500",
  purple: "!text-purple-500",
  gray: "!text-gray-500",
};

const backgroundColorClasses = {
  black: "bg-black",
  white: "bg-white border border-gray-300",
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  gray: "bg-gray-500",
};

const fontSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

interface AnnotationData {
  label: string;
  content: string;
  textColor?: keyof typeof textColorClasses;
  fontSize?: keyof typeof fontSizeClasses;
  arrowPosition?: { x: number; y: number };
  arrowRotation?: number;
  arrowFlip?: boolean;
}

export function AnnotationNode({ id, data, selected }: NodeProps) {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const annotationData = (data as Partial<AnnotationData>) || {};

  const [content, setContent] = useState(
    annotationData.content || defaultContent
  );
  const [textColor, setTextColor] = useState<AnnotationData["textColor"]>(
    annotationData.textColor || "black"
  );
  const [fontSize, setFontSize] = useState<AnnotationData["fontSize"]>(
    annotationData.fontSize || "sm"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  // Arrow states
  const [arrowPosition, setArrowPosition] = useState(
    annotationData.arrowPosition || { x: 50, y: 50 }
  );
  const [arrowRotation, setArrowRotation] = useState(
    annotationData.arrowRotation || 0
  );
  const [arrowFlip, setArrowFlip] = useState(annotationData.arrowFlip || false);

  const arrowRef = useRef<HTMLDivElement>(null);
  const arrowRotateControlRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with data prop
  useEffect(() => {
    setContent(annotationData.content || defaultContent);
  }, [annotationData.content]);

  useEffect(() => {
    setTextColor(annotationData.textColor || "black");
  }, [annotationData.textColor]);

  useEffect(() => {
    setFontSize(annotationData.fontSize || "sm");
  }, [annotationData.fontSize]);

  useEffect(() => {
    setArrowPosition(annotationData.arrowPosition || { x: 50, y: 50 });
  }, [annotationData.arrowPosition]);

  useEffect(() => {
    setArrowRotation(annotationData.arrowRotation || 0);
  }, [annotationData.arrowRotation]);

  useEffect(() => {
    setArrowFlip(annotationData.arrowFlip || false);
  }, [annotationData.arrowFlip]);

  const updateNodeData = useCallback(
    (
      newContent: string,
      newTextColor?: AnnotationData["textColor"],
      newFontSize?: AnnotationData["fontSize"],
      newArrowPosition?: { x: number; y: number },
      newArrowRotation?: number,
      newArrowFlip?: boolean
    ) => {
      setNodes(nodes =>
        nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                content: newContent,
                textColor: newTextColor || textColor,
                fontSize: newFontSize || fontSize,
                arrowPosition: newArrowPosition || arrowPosition,
                arrowRotation:
                  newArrowRotation !== undefined
                    ? newArrowRotation
                    : arrowRotation,
                arrowFlip:
                  newArrowFlip !== undefined ? newArrowFlip : arrowFlip,
              },
            };
          }
          return node;
        })
      );
    },
    [id, textColor, fontSize, arrowPosition, arrowRotation, arrowFlip, setNodes]
  );

  // Arrow drag handler
  useEffect(() => {
    if (!arrowRef.current || !containerRef.current) return;

    const selection = select(arrowRef.current);
    const dragHandler = drag()
      .on("drag", (evt: any) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const newX = Math.max(
          0,
          Math.min(
            100,
            ((evt.sourceEvent.clientX - rect.left) / rect.width) * 100
          )
        );
        const newY = Math.max(
          0,
          Math.min(
            100,
            ((evt.sourceEvent.clientY - rect.top) / rect.height) * 100
          )
        );
        const newPosition = { x: newX, y: newY };
        setArrowPosition(newPosition);
      })
      .on("end", () => {
        updateNodeData(
          content,
          textColor,
          fontSize,
          arrowPosition,
          arrowRotation,
          arrowFlip
        );
      });

    (selection as any).call(dragHandler);
  }, [content, textColor, fontSize, arrowRotation, arrowFlip, updateNodeData]);

  // Arrow rotation drag handler
  useEffect(() => {
    if (!arrowRotateControlRef.current) return;

    const selection = select(arrowRotateControlRef.current);
    const dragHandler = drag()
      .on("drag", (evt: any) => {
        const dx = evt.x - 25;
        const dy = evt.y - 25;
        const rad = Math.atan2(dx, dy);
        const deg = rad * (180 / Math.PI);
        const newArrowRotation = 180 - deg;
        setArrowRotation(newArrowRotation);
      })
      .on("end", () => {
        updateNodeData(
          content,
          textColor,
          fontSize,
          arrowPosition,
          arrowRotation,
          arrowFlip
        );
      });

    (selection as any).call(dragHandler);
  }, [content, textColor, fontSize, arrowPosition, arrowFlip, updateNodeData]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    updateNodeData(
      content,
      textColor,
      fontSize,
      arrowPosition,
      arrowRotation,
      arrowFlip
    );
  }, [
    content,
    textColor,
    fontSize,
    arrowPosition,
    arrowRotation,
    arrowFlip,
    updateNodeData,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        setContent(annotationData.content || defaultContent);
      }
    },
    [annotationData.content]
  );

  const handleTextColorChange = useCallback(
    (newColor: AnnotationData["textColor"]) => {
      setTextColor(newColor);
      setShowTextColorPicker(false);
      updateNodeData(
        content,
        newColor,
        fontSize,
        arrowPosition,
        arrowRotation,
        arrowFlip
      );
    },
    [content, fontSize, arrowPosition, arrowRotation, arrowFlip, updateNodeData]
  );

  const handleFontSizeChange = useCallback(
    (newSize: AnnotationData["fontSize"]) => {
      setFontSize(newSize);
      setShowFontPicker(false);
      updateNodeData(
        content,
        textColor,
        newSize,
        arrowPosition,
        arrowRotation,
        arrowFlip
      );
    },
    [
      content,
      textColor,
      arrowPosition,
      arrowRotation,
      arrowFlip,
      updateNodeData,
    ]
  );

  const handleArrowFlip = useCallback(() => {
    const newFlip = !arrowFlip;
    setArrowFlip(newFlip);
    updateNodeData(
      content,
      textColor,
      fontSize,
      arrowPosition,
      arrowRotation,
      newFlip
    );
  }, [
    arrowFlip,
    content,
    textColor,
    fontSize,
    arrowPosition,
    arrowRotation,
    updateNodeData,
  ]);

  const handleMouseEnter = useCallback(() => {
    globalEventBus.emit("annotation-hover", true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    globalEventBus.emit("annotation-hover", false);
  }, []);

  return (
    <>
      <NodeResizer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        selected={selected}
        isEditing={isEditing}
        className="border-none"
        ref={containerRef}
        allowScroll={true}
      >
        {/* Toolbar */}
        {selected && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-background rounded-md shadow-sm p-1 nodrag z-20">
            {/* Text Color Picker */}
            <Popover
              open={showTextColorPicker}
              onOpenChange={setShowTextColorPicker}
              className="py-2 px-3"
              trigger={
                <button
                  onClick={() => {
                    setShowTextColorPicker(!showTextColorPicker);
                    setShowFontPicker(false);
                  }}
                  className="p-1 hover:bg-accent rounded transition-colors"
                  title="Change text color"
                >
                  <Palette className="w-4 h-4" />
                </button>
              }
              content={
                <div className="flex gap-1">
                  {(
                    Object.keys(textColorClasses) as Array<
                      keyof typeof textColorClasses
                    >
                  ).map(c => (
                    <button
                      key={c}
                      onClick={() => handleTextColorChange(c)}
                      className={cn(
                        "w-6 h-6 rounded-full border",
                        backgroundColorClasses[c],
                        {
                          "ring-2 ring-primary": textColor === c,
                        }
                      )}
                      title={c}
                    />
                  ))}
                </div>
              }
            />

            {/* Font Size Picker */}
            <Popover
              open={showFontPicker}
              onOpenChange={setShowFontPicker}
              className="p-1"
              trigger={
                <button
                  onClick={() => {
                    setShowFontPicker(!showFontPicker);
                    setShowTextColorPicker(false);
                  }}
                  className="p-1 hover:bg-accent rounded transition-colors"
                  title="Change font size"
                >
                  <Type className="w-4 h-4" />
                </button>
              }
              content={
                <div className="flex flex-col gap-1">
                  {(["xs", "sm", "base", "lg"] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`px-2 py-1 text-left hover:bg-accent rounded ${
                        fontSize === size ? "bg-accent font-semibold" : ""
                      } ${fontSizeClasses[size]}`}
                    >
                      {size === "sm"
                        ? "Small"
                        : size === "base"
                          ? "Normal"
                          : size === "xs"
                            ? "Extra Small"
                            : "Large"}
                    </button>
                  ))}
                </div>
              }
            />

            {/* Arrow Flip Button */}
            <button
              onClick={handleArrowFlip}
              className="p-1 hover:bg-accent rounded transition-colors"
              title="Flip arrow"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Arrow */}
        <div
          ref={arrowRef}
          className={cn(
            "absolute cursor-move nodrag",
            textColorClasses[textColor || "black"]
          )}
          style={{
            left: `${arrowPosition.x}%`,
            top: `${arrowPosition.y}%`,
            transform: `translate(-50%, -50%) rotate(${arrowRotation}deg) scaleX(${arrowFlip ? -1 : 1})`,
          }}
          onDoubleClick={handleArrowFlip} // Double click to flip
        >
          <span>⤹</span>
          {/* Arrow Rotate Control */}
          {selected && (
            <div
              ref={arrowRotateControlRef}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full cursor-move nodrag"
            />
          )}
        </div>

        {/* Content */}
        <div
          className="w-full h-full p-3 overflow-hidden"
          onClick={e => isEditing && e.stopPropagation()}
          onWheel={e => e.stopPropagation()}
        >
          {isEditing ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onMouseDown={e => e.stopPropagation()}
              onClick={e => e.stopPropagation()}
              onWheel={e => e.stopPropagation()}
              autoFocus
              className={cn(
                "w-full h-full min-h-25 bg-transparent border-none resize-none focus:outline-none custom-scrollbar px-1",
                textColorClasses[textColor || "black"],
                fontSizeClasses[fontSize || "base"]
              )}
              placeholder="Type your annotation here..."
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              onWheel={e => e.stopPropagation()}
              className={cn(
                "markdown prose w-full h-full min-h-25 cursor-text overflow-auto custom-scrollbar px-1",
                textColorClasses[textColor || "black"],
                fontSizeClasses[fontSize || "base"]
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </NodeResizer>
    </>
  );
}
