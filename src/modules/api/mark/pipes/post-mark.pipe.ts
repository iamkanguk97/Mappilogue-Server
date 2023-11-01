import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { PostMarkRequestDto } from '../dtos/post-mark-request.dto';

@Injectable()
export class PostMarkPipe implements PipeTransform {
  private readonly logger = new Logger(PostMarkPipe.name);

  async transform<T extends { data: string }>(value: T) {
    if (!Object.keys(value).includes('data')) {
      throw new BadRequestException(
        CommonExceptionCode.MustKeyNameIsDataWhenMultipart,
      );
    }

    try {
      return plainToInstance(PostMarkRequestDto, JSON.parse(value.data));
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new BadRequestException(CommonExceptionCode.JsonFormatError);
      }
    }
  }
}
