import { Controller } from '@nestjs/common';
import { DomainNameEnum } from 'src/constants/enum';
import { UserHomeService } from '../services/user-home.service';

@Controller(DomainNameEnum.USER_HOME)
export class UserHomeController {
  constructor(private readonly userHomeService: UserHomeService) {}
}
