import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { MarkCategoryService } from '../services/mark-category.service';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';
import { isDefined } from 'src/helpers/common.helper';
import { IRequestWithUserType } from 'src/types/request-with-user.type';

@Injectable()
export class MarkCategoryValidationPipe implements PipeTransform {
  private readonly logger = new Logger(MarkCategoryValidationPipe.name);

  constructor(
    @Inject(REQUEST) private readonly request: IRequestWithUserType,
    private readonly markCategoryService: MarkCategoryService,
  ) {}

  async transform<T extends { id?: number; markCategoryId?: number }>(
    value: T,
  ): Promise<T> {
    try {
      const userId = this.request.user.id;
      const markCategoryId = value.id || value.markCategoryId;
      console.log(markCategoryId);

      if (!isDefined(markCategoryId)) {
        throw new BadRequestException(
          MarkCategoryExceptionCode.MarkCategoryIdEmpty,
        );
      }

      await this.markCategoryService.checkMarkCategoryStatus(
        userId,
        markCategoryId,
      );

      return value;
    } catch (err) {
      this.logger.error(`[MarkCategoryValidationPipe] ${err}`);
      throw err;
    }
  }
}
