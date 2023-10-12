export function isEmptyArray<T>(arr: Array<T>): boolean {
  return Array.isArray(arr) && arr.length === 0;
}
