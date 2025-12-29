import { useState, useCallback, useEffect } from "react";
import { NodeResizer, type NodeProps, useReactFlow } from "@xyflow/react";
import { Palette, Type } from "lucide-react";
import { cn, Popover } from "@sth87/shadcn-design-system";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { globalEventBus } from "@/core/events/EventBus";
import "./note.css";

const colorClasses = {
  yellow: "bg-[#fde68a]",
  blue: "bg-[#bfdbfe]",
  green: "bg-[#d9f99d]",
  pink: "bg-[#fecdd3]",
  purple: "bg-[#ddd6fe]",
  orange: "bg-[#fed7aa]",
  gray: "bg-[#e4e4e7]",
  transparent: "bg-transparent",
};

const fontSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};
interface NoteData {
  label: string;
  content: string;
  color?: keyof typeof colorClasses;
  fontSize?: keyof typeof fontSizeClasses;
}

export function NoteNode({ id, data, selected }: NodeProps) {
  const { setNodes } = useReactFlow();
  const noteData = (data as Partial<NoteData>) || {};

  const [content, setContent] = useState(
    noteData.content || "Double click to edit note..."
  );
  const [color, setColor] = useState<NoteData["color"]>(
    noteData.color || "yellow"
  );
  const [fontSize, setFontSize] = useState<NoteData["fontSize"]>(
    noteData.fontSize || "sm"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  // Sync state with data prop
  useEffect(() => {
    setContent(noteData.content || "Double click to edit note...");
  }, [noteData.content]);

  useEffect(() => {
    setColor(noteData.color || "yellow");
  }, [noteData.color]);

  useEffect(() => {
    setFontSize(noteData.fontSize || "sm");
  }, [noteData.fontSize]);

  const updateNodeData = useCallback(
    (
      newContent: string,
      newColor?: NoteData["color"],
      newFontSize?: NoteData["fontSize"]
    ) => {
      setNodes(nodes =>
        nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                content: newContent,
                color: newColor || color,
                fontSize: newFontSize || fontSize,
              },
            };
          }
          return node;
        })
      );
    },
    [id, color, fontSize, setNodes]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    updateNodeData(content, color, fontSize);
  }, [content, color, fontSize, updateNodeData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        setContent(noteData.content || "Double click to edit note...");
      }
      // Allow Enter for new lines in textarea
    },
    [noteData.content]
  );

  const handleColorChange = useCallback(
    (newColor: NoteData["color"]) => {
      setColor(newColor);
      setShowColorPicker(false);
      updateNodeData(content, newColor, fontSize);
    },
    [content, fontSize, updateNodeData]
  );

  const handleFontSizeChange = useCallback(
    (newSize: NoteData["fontSize"]) => {
      setFontSize(newSize);
      setShowFontPicker(false);
      updateNodeData(content, color, newSize);
    },
    [content, color, updateNodeData]
  );

  const handleMouseEnter = useCallback(() => {
    globalEventBus.emit("note-hover", true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    globalEventBus.emit("note-hover", false);
  }, []);

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={150}
        minHeight={100}
        handleStyle={{
          width: 8,
          height: 8,
          zIndex: 10,
        }}
        handleClassName="bg-primary/50! border-primary! rounded-xs!"
        lineClassName={cn(
          "border-primary!"
          // "ring-4! ring-primary/25!"
        )}
      />

      <div
        className={cn(
          "relative rounded-lg transition-all border",
          colorClasses[color || "yellow"],
          isEditing ? "nodrag shadow-lg" : ""
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: "100%",
          height: "100%",
          minWidth: 150,
          minHeight: 100,
        }}
      >
        {/* Toolbar */}
        {selected && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-background rounded-md shadow-sm p-1 nodrag">
            {/* Color Picker */}
            <Popover
              open={showColorPicker}
              onOpenChange={setShowColorPicker}
              className="py-2 px-3"
              trigger={
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowFontPicker(false);
                  }}
                  className="p-1 hover:bg-accent rounded transition-colors"
                  title="Change color"
                >
                  <Palette className="w-4 h-4" />
                </button>
              }
              content={
                <div className="flex gap-1">
                  {(
                    Object.keys(colorClasses) as Array<
                      keyof typeof colorClasses
                    >
                  ).map(c => (
                    <button
                      key={c}
                      onClick={() => handleColorChange(c)}
                      className={cn(
                        "w-6 h-6 rounded-full border",
                        colorClasses[c],
                        {
                          "border! border-primary!": color === c,
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
                    setShowColorPicker(false);
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
          </div>
        )}

        {/* Content */}
        <div className="w-full h-full p-3 overflow-hidden">
          {isEditing ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className={cn(
                "w-full h-full min-h-25 bg-transparent border-none resize-none focus:outline-none custom-scrollbar px-1",
                fontSizeClasses[fontSize || "base"],
                colorClasses[color || "yellow"]
              )}
              placeholder="Type your note here..."
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              className={cn(
                "markdown prose w-full h-full min-h-25 cursor-text overflow-auto custom-scrollbar px-1",
                {
                  [fontSizeClasses[fontSize || "base"]]: true,
                  [colorClasses[color || "yellow"]]: true,
                }
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Note corner fold effect */}
        {/* <div
          className="absolute bottom-0 right-0 w-0 h-0"
          style={{
            borderStyle: "solid",
            borderWidth: "0 0 10px 10px",
            borderColor: `transparent transparent ${
              color === "yellow"
                ? "#fbbf24"
                : color === "blue"
                  ? "#60a5fa"
                  : color === "green"
                    ? "#4ade80"
                    : color === "pink"
                      ? "#f472b6"
                      : color === "purple"
                        ? "#a78bfa"
                        : color === "orange"
                          ? "#fb923c"
                          : color === "gray"
                            ? "#a1a1aa"
                            : ""
            } transparent`,
          }}
        /> */}
      </div>
    </>
  );
}
