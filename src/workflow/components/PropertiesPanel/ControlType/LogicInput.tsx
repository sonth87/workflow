import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import { Textarea, cn } from "@sth87/shadcn-design-system";
import { useLanguage } from "@/workflow/hooks/useLanguage";
import { Code2 } from "lucide-react";

interface LogicControlProps {
  definition: PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function LogicControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: LogicControlProps) {
  const hasError = errors.length > 0;
  const { getText } = useLanguage();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          {getText(definition.label)}
          {definition.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </label>
      </div>
      <Textarea
        value={(value as string) || ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(e.target.value);
        }}
        placeholder={(getText(definition.placeholder as any) || "// Enter your logic here...") as string}
        required={definition.required}
        disabled={disabled || !!definition.readonly}
        rows={8}
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
      <p className="text-[10px] text-muted-foreground italic">
        Support JavaScript expression or script.
      </p>
    </div>
  );
}
