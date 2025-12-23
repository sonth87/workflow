import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Select, cn } from "@sth87/shadcn-design-system";

interface SelectProps {
  definition: PropertyDefinition | PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function SelectControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: SelectProps) {
  const hasError = errors.length > 0;

  // Get options from either old or new format
  const opts =
    "options" in definition && definition.options
      ? Array.isArray(definition.options)
        ? definition.options
        : definition.options.options || []
      : [];

  return (
    <div className="space-y-1.5">
      <Select
        value={(value as string) || ""}
        onChange={e => onChange(e)}
        label={definition.label}
        disabled={disabled || !!definition.readonly}
        options={opts.map(opt => ({
          label: opt.label,
          value: String(opt.value),
        }))}
        className={cn(hasError && "border-destructive")}
        infoTooltip={definition?.helpText as string}
      />
      {hasError && (
        <p className="text-xs text-destructive">{errors[0].message}</p>
      )}
    </div>
  );
}
