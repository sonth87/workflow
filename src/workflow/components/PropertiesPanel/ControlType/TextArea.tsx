import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Textarea, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

interface TextAreaProps {
  definition: PropertyDefinition | PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function TextAreaControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: TextAreaProps) {
  const hasError = errors.length > 0;
  const { getText } = useLanguage();

  // Convert multilingual value to string
  const displayValue = getText(value as any) || "";
  return (
    <div className="space-y-1.5">
      <Textarea
        value={displayValue}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        placeholder={
          (getText(definition.placeholder) || undefined) as string | undefined
        }
        label={getText(definition.label)}
        rows={3}
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
