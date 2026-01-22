import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Checkbox } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

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
  const { getText } = useLanguage();
  const hasError = errors.length > 0;
  const desc =
    "description" in definition
      ? (definition.description as any)
      : "helpText" in definition
        ? (definition.helpText as any)
        : undefined;

  return (
    <div className="space-y-1.5">
      <Checkbox
        checked={(value as boolean) || false}
        onCheckedChange={checked => onChange(checked)}
        label={getText(definition.label as any) || ""}
        disabled={disabled || !!definition.readonly}
      />
      {desc && !hasError && (
        <p className="text-xs text-muted-foreground ml-6">
          {getText(desc) || ""}
        </p>
      )}
      {hasError && (
        <p className="text-xs text-destructive ml-6">{errors[0].message}</p>
      )}
    </div>
  );
}
