import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MarkService } from '../services/mark.service';
import { UserId } from '../../user/decorators/user-id.decorator';
import { DeleteMarkRequestDto } from '../dtos/delete-mark-request.dto';
import { MarkValidationPipe } from '../pipes/mark-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateMarkImageMulterOption } from 'src/common/multer/multer.option';
import { ResponseEntity } from 'src/common/response-entity';

@Controller('marks')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @UseInterceptors(FilesInterceptor('image', 10, CreateMarkImageMulterOption()))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postMark(
    @UserId() userId: number,
    @UploadedFiles() files: Express.MulterS3.File[],
    @Body() body: any,
  ) {
    console.log(userId);
    console.log(files);
    console.log(body);
    const result = await this.markService.createMark(userId, files, body);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Delete('/:markId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMark(
    @UserId() userId: number,
    @Param(MarkValidationPipe) param: DeleteMarkRequestDto,
  ): Promise<void> {
    await this.markService.removeMark(userId, param.markId);
  }
}
