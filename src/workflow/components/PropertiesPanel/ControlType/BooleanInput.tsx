import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Checkbox } from "@sth87/shadcn-design-system";

interface BooleanControlProps {
  definition: PropertyDefinition | PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function BooleanControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: BooleanControlProps) {
  const hasError = errors.length > 0;
  const desc = (
    "description" in definition
      ? definition.description
      : "helpText" in definition
        ? definition.helpText
        : undefined
  ) as string | undefined;

  return (
    <div className="space-y-1.5">
      <Checkbox
        checked={(value as boolean) || false}
        onCheckedChange={checked => onChange(checked)}
        label={definition.label}
        disabled={disabled || !!definition.readonly}
      />
      {desc && !hasError && (
        <p className="text-xs text-muted-foreground ml-6">{desc}</p>
      )}
      {hasError && (
        <p className="text-xs text-destructive ml-6">{errors[0].message}</p>
      )}
    </div>
  );
}
