import { setExceptionCode } from '../common';

export const ScheduleExceptionCode = {
  ScheduleTitleLengthError: setExceptionCode(
    '2001',
    '일정 제목은 최소 1자에서 최대 50자까지 입력 가능합니다.',
  ),
  ScheduleStartDateEmpty: setExceptionCode(
    '2002',
    '일정 시작날짜를 입력해주세요.',
  ),
  ScheduleEndDateEmpty: setExceptionCode(
    '2003',
    '일정 종료날짜를 입력해주세요.',
  ),
  ScheduleColorIdEmpty: setExceptionCode(
    '2004',
    '일정의 색깔 고유값을 입력해주세요.',
  ),
  ScheduleStartDateInvalidFormat: setExceptionCode(
    '2005',
    '일정의 시작날짜가 유효하지 않습니다. yyyy-mm-dd 형태와 올바른 년월일을 입력해주세요.',
  ),
  ScheduleEndDateInvalidFormat: setExceptionCode(
    '2006',
    '일정의 종료날짜가 유효하지 않습니다. yyyy-mm-dd 형태와 올바른 년월일을 입력해주세요.',
  ),
  ScheduleAlarmMaxFive: setExceptionCode(
    '2007',
    '일정의 알림은 최대 5개까지 설정 가능합니다.',
  ),
  ScheduleAlarmOptionFormatError: setExceptionCode(
    '2008',
    '일정 알림은 yyyy-mm-ddThh:mm:ss 형식으로 입력해주세요.',
  ),
  ScheduleAreaDateEmpty: setExceptionCode(
    '2009',
    '일정에 해당하는 장소의 날짜를 입력해주세요.',
  ),
  ScheduleAreaDateInvalidFormat: setExceptionCode(
    '2010',
    '일정에 해당하는 장소의 날짜가 유효하지 않습니다. yyyy-mm-dd 형태와 올바른 년월일을 입력해주세요.',
  ),
  ScheduleAreaValueEmpty: setExceptionCode(
    '2011',
    '일정에 해당하는 장소의 정보가 누락되었습니다.',
  ),
  ScheduleAreaLatitudeEmpty: setExceptionCode(
    '2012',
    '일정 장소의 위도를 입력해주세요.',
  ),
  ScheduleAreaLongitudeEmpty: setExceptionCode(
    '2013',
    '일정 장소의 경도를 입력해주세요.',
  ),
  ScheduleAreaTimeErrorFormat: setExceptionCode(
    '2014',
    '일정 장소의 시간의 형식이 잘못되었습니다. h:mm AM/PM 형태로 입력해주세요.',
  ),
  ScheduleAreaStreetAddressEmpty: setExceptionCode(
    '2015',
    '일정 장소의 도로명 주소가 누락되었습니다.',
  ),
  ScheduleAreaStreetAddressLengthError: setExceptionCode(
    '2016',
    '일정 장소의 도로명 주소는 최대 100자까지 입력 가능합니다.',
  ),
  ScheduleAreaNameEmpty: setExceptionCode(
    '2017',
    '일정 장소의 이름이 누락되었습니다.',
  ),
  ScheduleAreaNameLengthError: setExceptionCode(
    '2018',
    '일정 장소의 이름은 최대 30자까지 입력 가능합니다.',
  ),
};