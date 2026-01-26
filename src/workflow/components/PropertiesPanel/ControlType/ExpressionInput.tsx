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
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Variable className="w-3.5 h-3.5" />
        {getText(definition.label)}
        {definition.required && (
          <span className="text-destructive ml-0.5">*</span>
        )}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-primary/50 font-mono text-xs select-none">
          f(x) =
        </div>
        <Input
          value={(value as string) || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
          }}
          placeholder={
            (getText(definition.placeholder as any) ||
              "e.g. status === 'approved'") as string
          }
          required={definition.required}
          disabled={disabled || !!definition.readonly}
          className={cn(
            "font-mono text-xs pl-12 bg-slate-950 text-slate-100 border-border focus:ring-1 focus:ring-primary/50 h-9",
            hasError && "border-destructive"
          )}
          infoTooltip={
            (getText(definition?.helpText as any) || undefined) as
              | string
              | undefined
          }
        />
      </div>
      {hasError && (
        <p className="text-xs text-destructive">{errors[0].message}</p>
      )}
    </div>
  );
}
