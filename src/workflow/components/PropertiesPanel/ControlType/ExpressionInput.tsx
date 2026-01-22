import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import { Input, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { Variable } from "lucide-react";

interface ExpressionControlProps {
  definition: PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function ExpressionControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: ExpressionControlProps) {
  const hasError = errors.length > 0;
  const { getText } = useLanguage();

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Variable className="w-4 h-4 text-primary" />
        {getText(definition.label)}
        {definition.required && (
          <span className="text-destructive ml-1">*</span>
        )}
      </label>
      <Input
        value={(value as string) || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
        placeholder={(getText(definition.placeholder as any) || "e.g. status === 'approved'") as string}
        required={definition.required}
        disabled={disabled || !!definition.readonly}
        className={cn(
          "font-mono text-xs",
          hasError && "border-destructive"
        )}
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
