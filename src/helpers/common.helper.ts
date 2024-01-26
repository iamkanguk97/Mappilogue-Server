import { isNaN } from 'lodash';
import { CheckColumnEnum } from 'src/constants/enum';

/**
 * @summary 빈 배열인지 확인하는 함수
 * @author  Jason
 * @param   { Array<T> } arr
 * @returns { boolean }
 */
export function isEmptyArray<T>(arr: Array<T>): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

/**
 * @summary 빈 객체인지 확인하는 함수
 * @author  Jason
 * @param   { Record<string, unknown> } obj
 * @returns { boolean }
 */
export function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * @summary null 또는 undefined인지 확인하는 함수
 * @author  Jason
 * @param   { T } value
 * @returns { value is NonNullable<T> }
 */
export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * @summary value가 있음 없음을 판단해서 CheckColumnEnum으로 반환
 * @author  Jason
 * @param   { T } value
 * @returns { CheckColumnEnum }
 */
export function setCheckColumnByValue<T>(value: T): CheckColumnEnum {
  return isDefined(value) ? CheckColumnEnum.ACTIVE : CheckColumnEnum.INACTIVE;
}

/**
 * @summary Numeric한 Value인지 확인 (매개변수는 무조건 문자열)
 * @author  Jason
 * @param   { string } value
 * @returns { boolean }
 */
export function isNumeric(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  return !isNaN(value) && !isNaN(parseFloat(value));
}
