import * as moment from 'moment';

/**
 * @summary 한국 시간 구하는 함수
 * @author  Jason
 * @returns { string } 한국시간
 */
export const getKoreaTime = (): string => {
  const offset = 1000 * 60 * 60 * 9;
  const koreaNow = new Date(new Date().getTime() + offset);
  return koreaNow.toISOString();
};

/**
 * @summary 특정 년과 달의 마지막 날짜를 구하는 함수
 * @author  Jason
 * @param   { number } year
 * @param   { number } month
 * @returns { number }
 */
export const getLastDate = (year: number, month: number): number => {
  return moment({ year, month: month - 1 })
    .endOf('month')
    .date();
};

/**
 * @summary     두 날짜 사이의 날짜가 맞는지 확인하는 함수
 * @description startDate와 endDate는 yyyy-mm-dd 형태로 들어와야 한다.
 * @author      Jason
 * @param       { string } startDate
 * @param       { string } endDate
 * @param       { string } targetDate
 * @returns     { boolean }
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

/**
 * @summary YYYY-MM-DD 형태의 날짜를 년월일로 바꿔주는 함수
 * @author  Jason
 * @param   { string } date
 * @returns { string } Y년 M월 D일
 */
export const getKoreanDateFormatBySingle = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * @summary year, month, day를 받아서 년월일로 바꿔주는 함수
 * @author  Jason
 * @param   { number } year
 * @param   { number } month
 * @param   { number } day
 * @returns { string } Y년 M월 D일
 */
export const getKoreanDateFormatByMultiple = (
  year: number,
  month: number,
  day: number,
): string => {
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * @summary     이번달의 첫째 날 요일을 구하는 함수
 * @description 일요일은 0이고, 이후 1씩 증가한다. 따라서 토요일은 6
 * @author      Jason
 * @param       { number } year
 * @param       { number } month
 * @returns     { number }
 */
export const getFirstDayOfWeek = (year: number, month: number): number => {
  const currentDate = moment({ year, month: month - 1 });
  const firstDayOfMonth = moment(currentDate).startOf('month');
  return firstDayOfMonth.day();
};

/**
 * @summary 특정 년월의 주말 리스트를 가져오는 함수 (캘린더의 주말리스트)
 * @author  Jason
 * @param   { number } year
 * @param   { number } month
 * @returns { string[][] }
 */
export const getWeekendsByYearAndMonth = (
  year: number,
  month: number,
): string[][] => {
  const dateFormat = 'YYYY-MM-DD';
  const momentCondition = { year, month: month - 1 };

  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  const firstSunday = moment(momentCondition).subtract(firstDayOfWeek, 'day');
  const firstSaturday = moment(momentCondition).add(6 - firstDayOfWeek, 'day');

  const result = [
    [firstSunday.format(dateFormat), firstSaturday.format(dateFormat)],
  ];

  for (let i = 0; i < 4; i++) {
    result.push([
      firstSunday.add(7, 'day').format(dateFormat),
      firstSaturday.add(7, 'day').format(dateFormat),
    ]);
  }

  // 여기서 사용한 firstSunday와 firstSaturday는 위에서 이미 더해져서 옴.
  if (
    firstSunday.month() + 1 === month &&
    firstSaturday.month() + 1 === month
  ) {
    result.push([
      firstSunday.add(7, 'day').format(dateFormat),
      firstSaturday.add(7, 'day').format(dateFormat),
    ]);
  }

  return result;
};

/**
 * @summary 년월을 가지고 날짜 리스트 가져오기
 * @author  Jason
 * @param   { number } year
 * @param   { number } month
 * @returns { string[] }
 */
export const getDateListByYearAndMonth = (
  year: number,
  month: number,
): string[] => {
  const last = getLastDate(year, month);
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const result = [];

  for (let i = 1; i <= last; i++) {
    const formattedDay = i < 10 ? `0${i}` : i.toString();
    result.push(`${year}-${formattedMonth}-${formattedDay}`);
  }

  return result;
};
