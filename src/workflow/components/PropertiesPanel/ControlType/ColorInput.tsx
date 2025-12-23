import type {
  PropertyFieldDefinition,
  ValidationError,
} from "@/core/properties";
import type { PropertyDefinition } from "@/core/types/base.types";
import { Input, cn } from "@sth87/shadcn-design-system";

interface ColorControlProps {
  definition: PropertyDefinition | PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  errors?: ValidationError[];
}

export function ColorControl({
  definition,
  value,
  onChange,
  disabled = false,
  errors = [],
}: ColorControlProps) {
  const hasError = errors.length > 0;
  const desc = (
    "description" in definition
      ? definition.description
      : "helpText" in definition
        ? definition.helpText
        : undefined
  ) as string | undefined;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {definition.label}
        {definition.required && (
          <span className="text-destructive ml-1">*</span>
        )}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={(value as string) || "#000000"}
          onChange={e => onChange(e.target.value)}
          disabled={disabled || !!definition.readonly}
          className="w-12 h-9 rounded border border-border cursor-pointer disabled:opacity-50"
        />
        <Input
          type="text"
          value={(value as string) || ""}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          disabled={disabled || !!definition.readonly}
          className={cn(hasError && "border-destructive")}
        />
      </div>
      {desc && !hasError && (
        <p className="text-xs text-muted-foreground">{desc}</p>
      )}
      {hasError && (
        <p className="text-xs text-destructive">{errors[0].message}</p>
      )}
    </div>
  );
}
