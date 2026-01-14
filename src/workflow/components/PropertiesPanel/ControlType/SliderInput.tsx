/**
 * SliderInput Control
 * Slider input với number display
 */

import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import { Slider, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

interface SliderControlProps {
  definition: PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function SliderControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: SliderControlProps) {
  const { getText } = useLanguage();
  const numValue =
    typeof value === "number"
      ? value
      : (definition.defaultValue as number) || 0;
  const min = definition.options?.min ?? 0;
  const max = definition.options?.max ?? 100;
  const step = definition.options?.step ?? 1;

  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  const hasError = errors.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {getText(definition.label as any)}
          {definition.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </label>
        <span className="text-sm text-muted-foreground font-mono">
          {numValue}
        </span>
      </div>

      <Slider
        value={[numValue]}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled || definition.readonly}
        className={cn(hasError && "border-destructive")}
      />

      {definition.helpText && !hasError && (
        <p className="text-xs text-muted-foreground">
          {getText(definition.helpText as any)}
        </p>
      )}

      {hasError && (
        <p className="text-xs text-destructive">{errors[0].message}</p>
      )}
    </div>
  );
}
