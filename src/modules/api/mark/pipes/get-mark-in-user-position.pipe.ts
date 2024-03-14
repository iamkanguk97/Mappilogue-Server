import { Inject, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IRequestWithUserType } from 'src/types/request-with-user.type';
import { MarkCategoryService } from '../services/mark-category.service';
import { isDefined } from 'src/helpers/common.helper';
import { GetMarkInUserPositionRequestDto } from '../dtos/request/get-mark-in-user-position-request.dto';

@Injectable()
export class GetMarkInUserPositionPipe implements PipeTransform {
  private readonly logger = new Logger(GetMarkInUserPositionPipe.name);

  constructor(
    @Inject(REQUEST) private readonly request: IRequestWithUserType,
    private readonly markCategoryService: MarkCategoryService,
  ) {}

  async transform(
    value: GetMarkInUserPositionRequestDto,
  ): Promise<GetMarkInUserPositionRequestDto> {
    try {
      const userId = this.request.user.id;

      if (isDefined(value.markCategoryId)) {
        await this.markCategoryService.checkMarkCategoryStatus(
          userId,
          value.markCategoryId,
        );
      }

      return value;
    } catch (err) {
      this.logger.error(`[GetMarkInUserPositionPipe] ${err}`);
      throw err;
    }
  }
}
