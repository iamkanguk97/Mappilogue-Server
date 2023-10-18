/**
 * @title 빈 배열인지 확인하는 함수
 * @param array
 * @returns
 */
export function isEmptyArray<T>(arr: Array<T>): boolean {
  return Array.isArray(arr) && arr.length === 0;
}
