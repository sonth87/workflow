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

import { Maximize2 } from "lucide-react";

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
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" />
          {getText(definition.label)}
          {definition.required && (
            <span className="text-destructive ml-0.5">*</span>
          )}
        </label>
        <button
          className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground"
          title="Expand editor"
          type="button"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
      <div className="relative group">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-muted/30 border-r border-border rounded-l-lg flex flex-col items-center pt-2 text-[10px] text-muted-foreground/50 font-mono select-none pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[1.25rem] leading-[1.25rem]">
              {i + 1}
            </div>
          ))}
        </div>
        <Textarea
          value={(value as string) || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(e.target.value);
          }}
          placeholder={
            (getText(definition.placeholder as any) ||
              "// Enter your logic here...") as string
          }
          required={definition.required}
          disabled={disabled || !!definition.readonly}
          rows={8}
          className={cn(
            "w-full pl-10 pr-3 py-2 text-xs font-mono rounded-lg border border-border bg-slate-950 text-slate-100 focus:ring-1 focus:ring-primary/50 resize-none leading-[1.25rem]",
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
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="italic">Supports JavaScript (ES6+)</span>
        <span>{(value as string)?.length || 0} characters</span>
      </div>
    </div>
  );
}
