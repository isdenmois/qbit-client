export const omit = <T>(key: string, obj: Record<string, T>): Record<string, T> => {
  const { [key]: _, ...rest } = obj
  return rest
}
