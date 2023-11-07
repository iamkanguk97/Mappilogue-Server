import { CheckColumnEnum } from 'src/constants/enum';
import * as _ from 'lodash';

/**
 * @title 빈 배열인지 확인하는 함수
 * @param array
 * @returns
 */
export function isEmptyArray<T>(arr: Array<T>): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

/**
 * @title value가 있음 없음을 판단해서 CheckColumnEnum으로 반환
 * @param value
 * @returns
 */
export function setCheckColumnByValue<T>(value: T): CheckColumnEnum {
  return _.isNil(value) ? CheckColumnEnum.INACTIVE : CheckColumnEnum.ACTIVE;
}

/**
 * @title null 또는 undefined인지 확인하는 함수
 * @param value
 * @returns
 */
export function isDefined<T>(value: T | undefined | null): boolean {
  return <T>value !== undefined && <T>value !== null;
}
