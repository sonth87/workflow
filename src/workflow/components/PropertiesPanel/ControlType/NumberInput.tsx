import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Input, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

interface NumberControlProps {
  definition: PropertyDefinition | PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function NumberControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: NumberControlProps) {
  const hasError = errors.length > 0;
  const { getText } = useLanguage();

  return (
    <div className="space-y-1.5">
      <Input
        type="number"
        value={(value as number) || ""}
        onChange={e => onChange(parseFloat(e.target.value))}
        placeholder={getText(definition.placeholder) || undefined}
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
