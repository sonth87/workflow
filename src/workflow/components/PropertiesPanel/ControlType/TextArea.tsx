import type { PropertyDefinition } from "@/core/types/base.types";
import { Textarea as STextArea } from "@sth87/shadcn-design-system";

interface TextAreaProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function TextAreaControl({
  definition,
  value,
  onChange,
}: TextAreaProps) {
  return (
    <STextArea
      value={(value as string) || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={definition.placeholder}
      infoTooltip={definition.description}
      label={definition.label}
      rows={3}
      required={definition.required}
      disabled={!!definition.readonly}
    />
  );
}
