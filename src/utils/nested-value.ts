export interface DefaultValues {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | undefined
}

export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): DefaultValues[string] => {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && current !== null && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as DefaultValues[string]
}
