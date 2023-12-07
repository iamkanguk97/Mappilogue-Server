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
 * @param   { object } obj
 * @returns { boolean}
 */
export function isEmptyObject<T>(obj: T): boolean {
  return !isDefined(obj) || Object.entries(obj).length === 0;
}

/**
 * @summary null 또는 undefined인지 확인하는 함수
 * @author  Jason
 * @param   { T | undefined | null } value
 * @returns { boolean }
 */
export function isDefined<T>(value: T | undefined | null): boolean {
  return <T>value !== undefined && <T>value !== null;
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
