import { MarkCategoryHelper } from './../helpers/mark-category.helper';
import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { MarkCategoryService } from '../services/mark-category.service';
import { MarkCategoryExceptionCode } from 'src/common/exception-code/mark-category.exception-code';

@Injectable()
export class MarkCategoryValidationPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly markCategoryService: MarkCategoryService,
    private readonly markCategoryHelper: MarkCategoryHelper,
  ) {}

  async transform<T extends { markCategoryId: number }>(value: T): Promise<T> {
    const userId = this.request['user'].id;
    const markCategoryId = value.markCategoryId;

    const markCategoryStatus = await this.markCategoryService.findOneById(
      markCategoryId,
    );

    if (!this.markCategoryHelper.isMarkCategoryExist(markCategoryStatus)) {
      throw new BadRequestException(
        MarkCategoryExceptionCode.MarkCategoryNotExist,
      );
    }

    if (markCategoryStatus.userId !== userId) {
      throw new BadRequestException(
        MarkCategoryExceptionCode.MarkCategoryNotMine,
      );
    }

    return value;
  }
}
