import { CheckColumnEnum } from 'src/constants/enum';

/**
 * @title 빈 배열인지 확인하는 함수
 * @param array
 * @returns
 */
export function isEmptyArray<T>(arr: Array<T>): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

/**
 * @summary 빈 객체인지 확인하는 함수
 * @author Jason
 *
 * @param { object } obj
 */
export function isEmptyObject<T>(obj: T): boolean {
  return Object.entries(obj).length === 0;
}

/**
 * @title null 또는 undefined인지 확인하는 함수
 * @param value
 * @returns
 */
export function isDefined<T>(value: T | undefined | null): boolean {
  return <T>value !== undefined && <T>value !== null;
}

/**
 * @title value가 있음 없음을 판단해서 CheckColumnEnum으로 반환
 * @param value
 * @returns
 */
export function setCheckColumnByValue<T>(value: T): CheckColumnEnum {
  return isDefined(value) ? CheckColumnEnum.ACTIVE : CheckColumnEnum.INACTIVE;
}
