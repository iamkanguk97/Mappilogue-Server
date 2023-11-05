import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { MarkService } from '../services/mark.service';
import { MarkHelper } from '../helpers/mark.helper';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import * as _ from 'lodash';

@Injectable()
export class MarkValidationPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly markService: MarkService,
    private readonly markHelper: MarkHelper,
  ) {}

  async transform<T extends { markId: number }>(value: T): Promise<T> {
    const userId = this.request['user'].id;
    const markId = value.markId;

    if (_.isNil(markId)) {
      throw new BadRequestException(MarkExceptionCode.MarkIdEmpty);
    }

    const markStatus = await this.markService.findOneById(markId);

    if (!this.markHelper.isMarkExist(markStatus)) {
      throw new BadRequestException(MarkExceptionCode.MarkNotExist);
    }

    if (markStatus.userId !== userId) {
      throw new BadRequestException(MarkExceptionCode.MarkNotMine);
    }

    return value;
  }
}
