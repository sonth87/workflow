import type { PropertyDefinition } from "@/core/types/base.types";
import { Input } from "@sth87/shadcn-design-system";

interface NumberControlProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function NumberControl({
  definition,
  value,
  onChange,
}: NumberControlProps) {
  return (
    <Input
      type="number"
      value={(value as number) || ""}
      onChange={e => onChange(parseFloat(e.target.value))}
      placeholder={definition.placeholder}
      infoTooltip={definition.description}
      label={definition.label}
      required={definition.required}
      disabled={!!definition.readonly}
    />
  );
}
