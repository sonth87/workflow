import type { PropertyDefinition } from "@/core/types/base.types";

interface SelectProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function Select({ definition, value, onChange }: SelectProps) {
  return (
    <select
      value={(value as string) || ""}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">Select...</option>
      {definition.options?.map(opt => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
