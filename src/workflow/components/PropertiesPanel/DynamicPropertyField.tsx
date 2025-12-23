import type {
  PropertyFieldDefinition,
  PropertyEntity,
  ValidationError,
} from "@/core/properties";
import {
  TextControl,
  NumberControl,
  TextAreaControl,
  BooleanControl,
  SelectControl,
  ColorControl,
  JsonControl,
  SliderControl,
  MultiSelectControl,
  DateControl,
} from "./ControlType";

interface DynamicPropertyFieldProps {
  definition: PropertyFieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  entity: PropertyEntity;
  disabled?: boolean;
  errors?: ValidationError[];
}

/**
 * Component render động field dựa trên type
 */
export function DynamicPropertyField({
  definition,
  value,
  onChange,
  entity,
  disabled = false,
  errors = [],
}: DynamicPropertyFieldProps) {
  // Nếu có custom renderer, dùng nó
  if (definition.customRenderer) {
    return definition.customRenderer({
      definition,
      value,
      onChange,
      entity,
      errors,
    });
  }

  // Render dựa trên field type
  switch (definition.type) {
    case "text":
      return (
        <TextControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "number":
      return (
        <NumberControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "textarea":
      return (
        <TextAreaControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "boolean":
      return (
        <BooleanControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "select":
      return (
        <SelectControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "multiselect":
      return (
        <MultiSelectControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "color":
      return (
        <ColorControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "slider":
      return (
        <SliderControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "date":
      return (
        <DateControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    case "json":
      return (
        <JsonControl
          definition={definition}
          value={value}
          onChange={onChange}
          disabled={disabled}
          errors={errors}
        />
      );

    default:
      return (
        <div className="text-xs text-muted-foreground">
          Unsupported field type: {definition.type}
        </div>
      );
  }
}
