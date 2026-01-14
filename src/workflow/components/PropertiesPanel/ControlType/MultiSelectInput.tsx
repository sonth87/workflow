/**
 * MultiSelectInput Control
 * Multi-select dropdown (simplified implementation)
 */

import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import { cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

interface MultiSelectControlProps {
  definition: PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function MultiSelectControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: MultiSelectControlProps) {
  const { getText } = useLanguage();
  const options = definition.options?.options || [];
  const selectedValues = Array.isArray(value) ? value : [];

  // For now, use a simple multi-line textarea representation
  // TODO: Implement proper multi-select when component is available
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const values = e.target.value.split("\n").filter(v => v.trim());
    onChange(values);
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

      <textarea
        value={selectedValues.join("\n")}
        onChange={handleChange}
        placeholder={
          (getText(definition.placeholder as any) ||
            "Enter values (one per line)...") as string
        }
        disabled={disabled || definition.readonly}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary",
          hasError && "border-destructive"
        )}
        rows={3}
      />

      {definition.helpText && !hasError && (
        <p className="text-xs text-muted-foreground">
          {getText(definition.helpText as any)}
        </p>
      )}

      {hasError && (
        <p className="text-xs text-destructive">{errors[0].message}</p>
      )}

      {options.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Available: {options.map(opt => getText(opt.label as any)).join(", ")}
        </div>
      )}
    </div>
  );
}
