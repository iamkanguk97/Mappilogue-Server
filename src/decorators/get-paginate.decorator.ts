import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { setPageNo, setPageSize } from 'src/helpers/paginate.helper';

/**
 * @summary 페이징 파라미터를 받아오는 데코레이터
 * @author  Jason
 * @returns { PageOptionsDto }
 */
export const GetPagination = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const pageNo = setPageNo(request.query?.pageNo);
    const pageSize = setPageSize(request.query?.pageSize);

    return new PageOptionsDto(pageNo, pageSize);
  },
);
