import type { PropertyDefinition, EdgeLabel } from "@/core/types/base.types";
import { TextInput } from "./TextInput";

interface EdgeLabelsInputProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function EdgeLabelsInput({ value, onChange }: EdgeLabelsInputProps) {
  const labels = (value as EdgeLabel[]) || [];

  const startLabel = labels.find(l => l.position === "start");
  const centerLabel = labels.find(l => l.position === "center");
  const endLabel = labels.find(l => l.position === "end");

  const handleLabelChange = (
    position: "start" | "center" | "end",
    text: string
  ) => {
    const newLabels = labels.filter(l => l.position !== position);

    if (text.trim()) {
      newLabels.push({
        text: text.trim(),
        position,
      });
    }

    onChange(newLabels);
  };

  return (
    <div className="space-y-3">
      {/* Start Label */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground/90">
          Start Label
        </label>
        <TextInput
          definition={{
            id: "startLabel",
            name: "startLabel",
            label: "Start Label",
            type: "text",
            placeholder: "Label at start position",
            required: false,
            order: 0,
          }}
          value={startLabel?.text || ""}
          onChange={value => handleLabelChange("start", value as string)}
        />
        <p className="text-xs text-muted-foreground">
          Label displayed at start of the edge path
        </p>
      </div>

      {/* Center Label */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground/90">
          Center Label
        </label>
        <TextInput
          definition={{
            id: "centerLabel",
            name: "centerLabel",
            label: "Center Label",
            type: "text",
            placeholder: "Label at center position",
            required: false,
            order: 1,
          }}
          value={centerLabel?.text || ""}
          onChange={value => handleLabelChange("center", value as string)}
        />
        <p className="text-xs text-muted-foreground">
          Label displayed at center of the edge path
        </p>
      </div>

      {/* End Label */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground/90">
          End Label
        </label>
        <TextInput
          definition={{
            id: "endLabel",
            name: "endLabel",
            label: "End Label",
            type: "text",
            placeholder: "Label at end position",
            required: false,
            order: 2,
          }}
          value={endLabel?.text || ""}
          onChange={value => handleLabelChange("end", value as string)}
        />
        <p className="text-xs text-muted-foreground">
          Label displayed at end of the edge path
        </p>
      </div>
    </div>
  );
}
