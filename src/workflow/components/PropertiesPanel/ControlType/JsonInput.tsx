import type { PropertyDefinition } from "@/core/types/base.types";
import { Textarea } from "@sth87/shadcn-design-system";

interface JsonControlProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function JsonControl({ definition, value, onChange }: JsonControlProps) {
  return (
    <Textarea
      value={
        typeof value === "string" ? value : JSON.stringify(value, null, 2) || ""
      }
      onChange={e => {
        try {
          onChange(JSON.parse(e.target.value));
        } catch {
          onChange(e.target.value);
        }
      }}
      placeholder={definition.placeholder || "{}"}
      infoTooltip={definition.description}
      label={definition.label}
      required={definition.required}
      disabled={!!definition.readonly}
      rows={5}
      className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
    />
  );
}
