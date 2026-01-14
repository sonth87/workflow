import { useMemo } from "react";
import dayjs from "dayjs";
import { FieldType } from "@/enum/workflow.enum";
import type {
  InputComponent,
  MultilingualTextType,
} from "@/types/dynamic-bpm.type";
import { getNestedValue, type DefaultValues } from "@/utils/nested-value";
import { useLanguage } from "./useLanguage";

interface UseBuildDefaultValueProps {
  fields: InputComponent[];
  responseData?: Record<string, unknown>;
  globalData?: Record<string, unknown>;
}

function formatDateTimeValue(
  value: unknown,
  fieldType: FieldType,
  format?: string
): string | number | boolean | string[] | number[] | boolean[] | undefined {
  if (!value) {
    return value as undefined;
  }
  const dayjsDate = dayjs(value as string | number | Date, format);

  if (!dayjsDate.isValid()) {
    return value as
      | string
      | number
      | boolean
      | string[]
      | number[]
      | boolean[]
      | undefined;
  }

  if (format) {
    return dayjsDate.format(format);
  }

  switch (fieldType) {
    case FieldType.DATE: {
      return dayjsDate.format("YYYY-MM-DD");
    }

    case FieldType.DATE_TIME: {
      return dayjsDate.format("YYYY-MM-DDTHH:mm");
    }

    case FieldType.TIME: {
      return dayjsDate.format("HH:mm");
    }

    default: {
      return value as
        | string
        | number
        | boolean
        | string[]
        | number[]
        | boolean[]
        | undefined;
    }
  }
}

export default function useBuildDefaultValue({
  fields,
  responseData,
  globalData,
}: UseBuildDefaultValueProps) {
  const { getText } = useLanguage();
  const defaultValues = useMemo<DefaultValues>(() => {
    const result: DefaultValues = {};

    fields.forEach(field => {
      const { field_code, value, field_type, format } = field;

      // Check if value starts with $ (dynamic value from responseData)
      if (typeof value === "string" && value.startsWith("$")) {
        // Remove the $ prefix and get the path
        const path = value.substring(1);

        // Get value from responseData using the path
        if (responseData) {
          let dynamicValue = getNestedValue(responseData, path);

          // Format date/time fields
          if (
            field_type === FieldType.DATE ||
            field_type === FieldType.DATE_TIME ||
            field_type === FieldType.TIME
          ) {
            dynamicValue = formatDateTimeValue(
              dynamicValue,
              field_type,
              format
            );
          }

          // Check if dynamicValue is a multilingual object
          if (
            typeof dynamicValue === "object" &&
            dynamicValue !== null &&
            !Array.isArray(dynamicValue)
          ) {
            const obj = dynamicValue as Record<string, unknown>;
            // Check if it has vi/en structure (multilingual)
            if ("vi" in obj || "en" in obj) {
              result[field_code] = getText(
                dynamicValue as unknown as MultilingualTextType
              );
            } else {
              result[field_code] = JSON.stringify(dynamicValue);
            }
          } else {
            result[field_code] = dynamicValue;
          }
        } else {
          // If no responseData, use undefined as default
          result[field_code] = undefined;
        }
      } else if (typeof value === "string" && value.startsWith("#")) {
        const path = value.substring(1);
        if (globalData) {
          let dynamicValue = getNestedValue(globalData, path);

          // Format date/time fields
          if (
            field_type === FieldType.DATE ||
            field_type === FieldType.DATE_TIME ||
            field_type === FieldType.TIME
          ) {
            dynamicValue = formatDateTimeValue(
              dynamicValue,
              field_type,
              format
            );
          }

          result[field_code] = dynamicValue;
        }
      } else {
        // Use the value property as default value
        // Format if it's a date/time field with static value
        let finalValue = value;
        if (
          field_type === FieldType.DATE ||
          field_type === FieldType.DATE_TIME ||
          field_type === FieldType.TIME
        ) {
          finalValue = formatDateTimeValue(value, field_type, format);
        }
        result[field_code] = finalValue;
      }
    });

    return result;
  }, [fields, getText, globalData, responseData]);

  return defaultValues;
}
