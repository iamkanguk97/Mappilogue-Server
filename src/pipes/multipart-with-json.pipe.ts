import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';
import { PostMarkRequestDto } from 'src/modules/api/mark/dtos/post-mark-request.dto';

@Injectable()
export class MultipartWithJsonPipe implements PipeTransform {
  private readonly logger = new Logger(MultipartWithJsonPipe.name);

  transform<T extends { data: string }>(value: T) {
    if (!Object.keys(value).includes('data')) {
      throw new BadRequestException(
        CommonExceptionCode.MustKeyNameIsDataWhenMultipart,
      );
    }

    try {
      // return JSON.parse(value.data);
      return plainToInstance(PostMarkRequestDto, value.data);
    } catch (err) {
      console.log(err);
      this.logger.error(err);
      throw new BadRequestException(CommonExceptionCode.JsonFormatError);
    }
  }
}
