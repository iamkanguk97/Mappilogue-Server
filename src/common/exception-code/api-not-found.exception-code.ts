import { setExceptionCode } from '../common';

export const NotFoundExceptionCode = {
  ApiNotFoundError: setExceptionCode('7001', 'API NOT FOUND!'),
  PageNotFoundError: setExceptionCode(
    '7002',
    '해당 페이지는 존재하지 않습니다.',
  ),
};
