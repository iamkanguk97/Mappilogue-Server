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
