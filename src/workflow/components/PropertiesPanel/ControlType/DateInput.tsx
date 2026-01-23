/**
 * DateInput Control
 * Date picker input
 */

import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import { DatePicker, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

interface DateControlProps {
  definition: PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function DateControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: DateControlProps) {
  const { getText } = useLanguage();
  const dateValue =
    value instanceof Date
      ? value.toISOString().split("T")[0]
      : typeof value === "string"
        ? value
        : "";

  const handleChange = (newValue?: string) => {
    onChange(newValue ? new Date(newValue) : null);
  };

  const hasError = errors.length > 0;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {getText(definition.label as any)}
        {definition.required && (
          <span className="text-destructive ml-1">*</span>
        )}
      </label>

      <DatePicker
        value={dateValue}
        onChange={(_, value) => handleChange(value)}
        disabled={disabled || definition.readonly}
        className={cn(hasError && "border-destructive")}
        min={
          definition.options?.minDate
            ? new Date(definition.options.minDate).toISOString().split("T")[0]
            : undefined
        }
        max={
          definition.options?.maxDate
            ? new Date(definition.options.maxDate).toISOString().split("T")[0]
            : undefined
        }
        placeholder={
          (getText(definition.placeholder as any) || undefined) as
            | string
            | undefined
        }
        infoTooltip={
          (getText(definition?.helpText as any) || undefined) as
            | string
            | undefined
        }
      />

      {hasError && (
        <p className="text-xs text-destructive">{errors[0].message}</p>
      )}
    </div>
  );
}
