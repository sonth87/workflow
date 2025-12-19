import type { PropertyDefinition } from "@/core/types/base.types";

interface ColorInputProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function ColorInput({ definition, value, onChange }: ColorInputProps) {
  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={(value as string) || "#000000"}
        onChange={e => onChange(e.target.value)}
        className="w-12 h-9 rounded border border-border cursor-pointer"
      />
      <input
        type="text"
        value={(value as string) || ""}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
