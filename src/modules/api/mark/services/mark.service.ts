import { Injectable } from '@nestjs/common';
import { MarkRepository } from '../repositories/mark.repository';

@Injectable()
export class MarkService {
  constructor(private readonly markRepository: MarkRepository) {}
}
