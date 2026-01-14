import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Textarea, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";

interface JsonControlProps {
  definition: PropertyDefinition | PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function JsonControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: JsonControlProps) {
  const hasError = errors.length > 0;
  const { getText } = useLanguage();

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {getText(definition.label)}
        {definition.required && (
          <span className="text-destructive ml-1">*</span>
        )}
      </label>
      <Textarea
        value={
          typeof value === "string"
            ? value
            : JSON.stringify(value, null, 2) || ""
        }
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            onChange(e.target.value);
          }
        }}
        placeholder={(getText(definition.placeholder as any) || "{}") as string}
        required={definition.required}
        disabled={disabled || !!definition.readonly}
        rows={5}
        className={cn(
          "w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none",
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
