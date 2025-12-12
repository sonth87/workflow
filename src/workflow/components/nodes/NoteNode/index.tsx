import { useState, useCallback } from "react";
import { NodeResizer, type NodeProps, useReactFlow } from "@xyflow/react";
import { Palette, Type } from "lucide-react";

interface NoteData {
  label: string;
  content: string;
  color?: "yellow" | "blue" | "green" | "pink" | "purple" | "orange";
  fontSize?: "sm" | "base" | "lg";
}

const colorClasses = {
  yellow: "bg-yellow-100 border-yellow-300 text-yellow-900",
  blue: "bg-blue-100 border-blue-300 text-blue-900",
  green: "bg-green-100 border-green-300 text-green-900",
  pink: "bg-pink-100 border-pink-300 text-pink-900",
  purple: "bg-purple-100 border-purple-300 text-purple-900",
  orange: "bg-orange-100 border-orange-300 text-orange-900",
};

const fontSizeClasses = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

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
    noteData.fontSize || "base"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

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

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={150}
        minHeight={100}
        handleStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
        }}
      />

      <div
        className={`relative border-2 rounded-lg shadow-md transition-all ${
          colorClasses[color || "yellow"]
        } ${selected ? "ring-2 ring-primary ring-offset-2" : ""}`}
        style={{
          width: "100%",
          height: "100%",
          minWidth: 150,
          minHeight: 100,
        }}
      >
        {/* Toolbar */}
        {selected && (
          <div className="absolute -top-8 left-0 flex gap-1 bg-background border rounded shadow-sm p-1 nodrag">
            {/* Color Picker */}
            <div className="relative">
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
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 flex gap-1 bg-background border rounded shadow-lg p-2 z-50">
                  {(
                    Object.keys(colorClasses) as Array<
                      keyof typeof colorClasses
                    >
                  ).map(c => (
                    <button
                      key={c}
                      onClick={() => handleColorChange(c)}
                      className={`w-6 h-6 rounded border-2 ${colorClasses[c]} ${
                        color === c ? "ring-2 ring-primary" : ""
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Picker */}
            <div className="relative">
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
              {showFontPicker && (
                <div className="absolute top-full left-0 mt-1 flex flex-col gap-1 bg-background border rounded shadow-lg p-2 z-50 min-w-20">
                  {(["sm", "base", "lg"] as const).map(size => (
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
                          : "Large"}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              className={`w-full h-full bg-transparent border-none resize-none focus:outline-none ${
                fontSizeClasses[fontSize || "base"]
              } ${colorClasses[color || "yellow"]}`}
              placeholder="Type your note here..."
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              className={`w-full h-full whitespace-pre-wrap wrap-break-word cursor-text ${
                fontSizeClasses[fontSize || "base"]
              }`}
            >
              {content}
            </div>
          )}
        </div>

        {/* Note corner fold effect */}
        <div
          className="absolute bottom-0 right-0 w-0 h-0"
          style={{
            borderStyle: "solid",
            borderWidth: "0 0 20px 20px",
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
                        : "#fb923c"
            } transparent`,
          }}
        />
      </div>
    </>
  );
}
