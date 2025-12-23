/**
 * PropertyGroup Component
 * Render một group của properties
 */

import type {
  PropertyGroupDefinition,
  PropertyEntity,
} from "@/core/properties";
import { DynamicPropertyField } from "./DynamicPropertyField";
import { usePropertySync, usePropertyValidation } from "./hooks";

interface PropertyGroupProps {
  group: PropertyGroupDefinition;
  entity: PropertyEntity;
  propertyGroups: PropertyGroupDefinition[];
}

/**
 * Component render một property group với tất cả fields
 */
export function PropertyGroup({
  group,
  entity,
  propertyGroups,
}: PropertyGroupProps) {
  const { handlePropertyChange, isFieldDisabled, isFieldVisible } =
    usePropertySync(entity, propertyGroups);

  const { getFieldErrors } = usePropertyValidation(entity, propertyGroups);

  // Filter visible fields
  const visibleFields = group.fields.filter(field => isFieldVisible(field));

  if (visibleFields.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        No properties available in this group
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {group.description && (
        <p className="text-sm text-muted-foreground">{group.description}</p>
      )}

      <div className="space-y-3">
        {visibleFields.map(field => {
          // Get value based on field type
          let value: unknown = field.defaultValue;

          if (field.id === "id") {
            // ID field lấy từ entity.id
            value = entity.id;
          } else if (field.id === "description") {
            // Description field lấy từ metadata hoặc data
            value =
              entity.metadata?.description ??
              entity.data?.description ??
              field.defaultValue;
          } else {
            // Other fields: properties first, then data, then default
            value =
              entity.properties?.[field.id] ??
              entity.data?.[field.id] ??
              field.defaultValue;
          }

          const disabled = isFieldDisabled(field);
          const errors = getFieldErrors(field.id);

          return (
            <DynamicPropertyField
              key={field.id}
              definition={field}
              value={value}
              onChange={value => handlePropertyChange(field.id, value)}
              entity={entity}
              disabled={disabled}
              errors={errors}
            />
          );
        })}
      </div>
    </div>
  );
}
