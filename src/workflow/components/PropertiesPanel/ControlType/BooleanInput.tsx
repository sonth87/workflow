import type { PropertyDefinition } from "@/core/types/base.types";
import { Checkbox } from "@sth87/shadcn-design-system";

interface BooleanControlProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function BooleanControl({
  definition,
  value,
  onChange,
}: BooleanControlProps) {
  return (
    <Checkbox
      checked={(value as boolean) || false}
      onCheckedChange={checked => onChange(checked)}
      label={definition.label}
      infoTooltip={definition.description}
      disabled={!!definition.readonly}
    />
  );
}
