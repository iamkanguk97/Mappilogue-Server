import { isDefined } from 'src/helpers/common.helper';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { GetMarkListByCategoryRequestDto } from '../dtos/request/get-mark-list-by-category-request.dto';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { MarkCategoryService } from '../services/mark-category.service';
import { IRequestWithUserType } from 'src/types/request-with-user.type';

@Injectable()
export class GetMarkListByCategoryValidationPipe implements PipeTransform {
  private readonly logger = new Logger(
    GetMarkListByCategoryValidationPipe.name,
  );

  constructor(
    @Inject(REQUEST) private readonly request: IRequestWithUserType,
    private readonly markCategoryService: MarkCategoryService,
  ) {}

  async transform(
    value: GetMarkListByCategoryRequestDto,
  ): Promise<GetMarkListByCategoryRequestDto> {
    try {
      const userId = this.request.user.id;
      const markCategoryId = value.markCategoryId;

      if (!isDefined(markCategoryId)) {
        throw new BadRequestException(
          MarkCategoryExceptionCode.MarkCategoryIdEmpty,
        );
      }

      // markCategoryId가 -1이면 전체 카테고리를 조회한다.
      if (markCategoryId !== -1) {
        await this.markCategoryService.checkMarkCategoryStatus(
          userId,
          markCategoryId,
        );
      }

      return value;
    } catch (err) {
      this.logger.error(`[GetMarkListByCategoryValidationPipe] ${err}`);
      throw err;
    }
  }
}
