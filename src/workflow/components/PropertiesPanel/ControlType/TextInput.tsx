import type { PropertyDefinition } from "@/core/types/base.types";

interface TextInputProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function TextInput({ definition, value, onChange }: TextInputProps) {
  return (
    <input
      type="text"
      value={(value as string) || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={definition.placeholder}
      className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}
