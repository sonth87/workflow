import type { PropertyDefinition } from "@/core/types/base.types";

interface NumberInputProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function NumberInput({ definition, value, onChange }: NumberInputProps) {
  return (
    <input
      type="number"
      value={(value as number) || ""}
      onChange={e => onChange(parseFloat(e.target.value))}
      placeholder={definition.placeholder}
      className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}
