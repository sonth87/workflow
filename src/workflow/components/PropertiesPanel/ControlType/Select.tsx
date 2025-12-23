import type { PropertyDefinition } from "@/core/types/base.types";
import { Select } from "@sth87/shadcn-design-system";

interface SelectProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function SelectControl({ definition, value, onChange }: SelectProps) {
  return (
    <Select
      value={(value as string) || ""}
      onChange={e => onChange(e)}
      infoTooltip={definition.description}
      label={definition.label}
      disabled={!!definition.readonly}
      options={definition?.options?.map(opt => ({
        label: opt.label,
        value: String(opt.value),
      }))}
    />
  );
}
