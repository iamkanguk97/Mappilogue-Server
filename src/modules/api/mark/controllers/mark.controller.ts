import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { MarkService } from '../services/mark.service';
import { UserId } from '../../user/decorators/user-id.decorator';
import { DeleteMarkRequestDto } from '../dtos/delete-mark-request.dto';
import { MarkValidationPipe } from '../pipes/mark-validation.pipe';

@Controller('marks')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Delete('/:markId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMark(
    @UserId() userId: number,
    @Param(MarkValidationPipe) param: DeleteMarkRequestDto,
  ): Promise<void> {
    await this.markService.removeMark(userId, param.markId);
  }
}
