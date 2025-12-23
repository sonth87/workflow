import type { PropertyDefinition } from "@/core/types/base.types";
import { Input } from "@sth87/shadcn-design-system";

interface ColorControlProps {
  definition: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function ColorControl({
  definition,
  value,
  onChange,
}: ColorControlProps) {
  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={(value as string) || "#000000"}
        onChange={e => onChange(e.target.value)}
        className="w-12 h-9 rounded border border-border cursor-pointer"
      />
      <Input
        type="text"
        value={(value as string) || ""}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
      />
    </div>
  );
}
