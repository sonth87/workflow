import type { PropertyDefinition } from "@/core/types/base.types";

interface BooleanInputProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function BooleanInput({
  definition,
  value,
  onChange,
}: BooleanInputProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={(value as boolean) || false}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
      />
      <span className="text-sm">{definition.label}</span>
    </label>
  );
}
