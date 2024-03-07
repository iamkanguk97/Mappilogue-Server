import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { MarkService } from '../services/mark.service';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { isDefined } from 'src/helpers/common.helper';
import { MarkDto } from '../dtos/common/mark.dto';
import { IRequestWithUserType } from 'src/types/request-with-user.type';

@Injectable()
export class MarkValidationPipe implements PipeTransform {
  private readonly logger = new Logger(MarkValidationPipe.name);

  constructor(
    @Inject(REQUEST) private readonly request: IRequestWithUserType,
    private readonly markService: MarkService,
  ) {}

  async transform<T extends { markId: number }>(value: T): Promise<MarkDto> {
    try {
      const userId = this.request.user.id;
      const markId = value?.markId;

      if (!isDefined(markId)) {
        throw new BadRequestException(MarkExceptionCode.MarkIdEmpty);
      }

      return await this.markService.checkMarkStatus(userId, markId);
    } catch (err) {
      this.logger.error(`[MarkValidationPipe] ${err}`);
      throw err;
    }
  }
}
