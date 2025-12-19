import type { PropertyDefinition } from "@/core/types/base.types";

interface JsonInputProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function JsonInput({ definition, value, onChange }: JsonInputProps) {
  return (
    <textarea
      value={
        typeof value === "string" ? value : JSON.stringify(value, null, 2) || ""
      }
      onChange={e => {
        try {
          onChange(JSON.parse(e.target.value));
        } catch {
          onChange(e.target.value);
        }
      }}
      placeholder={definition.placeholder || "{}"}
      rows={5}
      className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
    />
  );
}
