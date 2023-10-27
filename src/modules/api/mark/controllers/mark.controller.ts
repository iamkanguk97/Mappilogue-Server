import { Controller } from '@nestjs/common';
import { MarkService } from '../services/mark.service';

@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}
}
