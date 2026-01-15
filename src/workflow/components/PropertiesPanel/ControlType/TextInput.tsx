import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Input, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

interface TextControlProps {
  definition: PropertyDefinition | PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function TextControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: TextControlProps) {
  const hasError = errors.length > 0;
  const { getText } = useLanguage();

  // Convert multilingual value to string
  const displayValue = getText(value as any) || "";

  return (
    <div className="space-y-1.5">
      <Input
        type="text"
        value={displayValue}
        onChange={e => onChange(e.target.value)}
        placeholder={
          (getText(definition.placeholder) || undefined) as string | undefined
        }
        label={getText(definition.label)}
        required={definition.required}
        disabled={disabled || !!definition.readonly}
        className={cn(hasError && "border-destructive")}
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
