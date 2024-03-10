import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { setPageNo, setPageSize } from 'src/helpers/paginate.helper';

interface IPageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  readonly pageNo: number;
  readonly pageSize: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
    this.pageNo = setPageNo(pageOptionsDto.pageNo);
    this.pageSize = setPageSize(pageOptionsDto.pageSize);
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.pageSize);
    this.hasPreviousPage = this.pageNo > 1;
    this.hasNextPage = this.pageNo < this.pageCount;
  }
}
