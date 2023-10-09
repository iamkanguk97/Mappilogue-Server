import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
