import type { PropertyDefinition } from "@/core/types/base.types";
import { Input } from "@sth87/shadcn-design-system";

interface TextControlProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function TextControl({ definition, value, onChange }: TextControlProps) {
  return (
    <Input
      type="text"
      value={(value as string) || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={definition.placeholder}
      infoTooltip={definition.description}
      label={definition.label}
      required={definition.required}
      disabled={!!definition.readonly}
    />
  );
}
