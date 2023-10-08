import { Injectable } from '@nestjs/common';
import { ColorRepository } from '../repositories';

@Injectable()
export class ColorService {
  constructor(private readonly colorRepository: ColorRepository) {}

  async findColorList() {
    return this.colorRepository.find();
  }
}
