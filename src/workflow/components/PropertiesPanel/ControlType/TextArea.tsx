import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Textarea, cn } from "@sth87/shadcn-design-system";

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

  return (
    <div className="space-y-1.5">
      <Textarea
        value={(value as string) || ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={definition.placeholder}
        label={definition.label}
        rows={3}
        required={definition.required}
        disabled={disabled || !!definition.readonly}
        className={cn(hasError && "border-destructive")}
        infoTooltip={definition?.helpText as string}
      />
      {hasError && (
        <p className="text-xs text-destructive">{errors[0].message}</p>
      )}
    </div>
  );
}
