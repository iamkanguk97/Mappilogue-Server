import * as moment from 'moment';

/**
 * @title 한국 시간 구하는 함수
 */
export const getKoreaTime = () => {
  const offset = 1000 * 60 * 60 * 9;
  const koreaNow = new Date(new Date().getTime() + offset);
  return koreaNow.toISOString();
};

/**
 * @title 특정 년과 달의 마지막 날짜를 구하는 함수
 * @param year
 * @param month
 * @returns
 */
export const getLastDate = (year: number, month: number): number => {
  return moment({ year, month: month - 1 })
    .endOf('month')
    .date();
};

/**
 * @title 두 날짜 사이의 날짜가 맞는지 확인하는 함수
 * @description startDate와 endDate는 yyyy-mm-dd 형태로 들어와야 한다.
 * @param startDate
 * @param endDate
 * @param targetDate
 * @returns
 */
export const checkBetweenDatesWithNoMoment = (
  startDate: string,
  endDate: string,
  targetDate: string,
): boolean => {
  return (
    moment(startDate) <= moment(targetDate) &&
    moment(targetDate) <= moment(endDate)
  );
};

export const getKoreanDateFormatBySingle = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
};

export const getKoreanDateFormatByMultiple = (
  year: number,
  month: number,
  day: number,
): string => {
  return `${year}년 ${month}월 ${day}일`;
};
