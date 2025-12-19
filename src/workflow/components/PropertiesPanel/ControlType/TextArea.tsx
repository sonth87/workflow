import type { PropertyDefinition } from "@/core/types/base.types";

interface TextAreaProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function TextArea({ definition, value, onChange }: TextAreaProps) {
  return (
    <textarea
      value={(value as string) || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={definition.placeholder}
      rows={3}
      className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
    />
  );
}
