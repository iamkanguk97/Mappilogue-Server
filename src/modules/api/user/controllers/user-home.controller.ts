import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { DomainNameEnum } from 'src/constants/enum';
import { UserHomeService } from '../services/user-home.service';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { GetPagination } from 'src/decorators/get-paginate.decorator';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { ResponseWithPageEntity } from 'src/common/entities/response-with-page.entity';
import { AnnouncementEntity } from '../entities/announcement.entity';

@Controller(DomainNameEnum.USER_HOME)
@UseInterceptors(ClassSerializerInterceptor)
export class UserHomeController {
  constructor(private readonly userHomeService: UserHomeService) {}

  /**
   * @summary 공지사항 조회 API
   * @author  Jason
   * @url     /api/v1/users/homes/announcements
   * @returns { Promise<ResponseWithPageEntity<AnnouncementEntity[]>> }
   */
  @Public()
  @Get('announcements')
  @HttpCode(HttpStatus.OK)
  async getAnnouncements(
    @GetPagination() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseWithPageEntity<AnnouncementEntity[]>> {
    const result = await this.userHomeService.findAnnouncements(pageOptionsDto);
    return ResponseWithPageEntity.OK_WITH_PAGINATION(HttpStatus.OK, result);
  }
}
