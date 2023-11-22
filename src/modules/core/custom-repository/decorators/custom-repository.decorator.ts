import { SetMetadata } from '@nestjs/common';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from '../constants/custom-repository.constant';

export function CustomRepository(entity: unknown): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
