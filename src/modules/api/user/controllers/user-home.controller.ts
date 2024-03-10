import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { EDomainName } from 'src/constants/enum';
import { UserHomeService } from '../services/user-home.service';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { GetPagination } from 'src/decorators/get-paginate.decorator';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { UserId } from '../decorators/user-id.decorator';
import { GetHomeRequestDto } from '../dtos/request/get-home-request.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { GetHomeResponseDto } from '../dtos/response/get-home-response.dto';

@Controller(EDomainName.USER_HOME)
@UseInterceptors(ClassSerializerInterceptor)
export class UserHomeController {
  constructor(private readonly userHomeService: UserHomeService) {}

  /**
   * @summary 공지사항 조회 API
   * @author  Jason
   * @url     /api/v1/users/homes/announcements?pageNo=&pageSize=
   * @returns { Promise<ResponseWithPageEntity<AnnouncementEntity[]>> }
   */
  @Public()
  @Get('announcements')
  @HttpCode(HttpStatus.OK)
  async getAnnouncements(
    @GetPagination() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseEntity<AnnouncementEntity[]>> {
    const result = await this.userHomeService.findAnnouncements(pageOptionsDto);
    return ResponseEntity.OK_WITH_PAGINATION(HttpStatus.OK, result);
  }

  /**
   * @summary 홈화면 조회 API
   * @author  Jason
   * @url     [GET] /api/v1/users/homes?option=
   * @returns { Promise<ResponseEntity<GetHomeResponseDto>> }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHomes(
    @UserId() userId: number,
    @Query() query: GetHomeRequestDto,
  ): Promise<ResponseEntity<GetHomeResponseDto>> {
    const result = await this.userHomeService.findHomes(userId, query.option);
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }
}
