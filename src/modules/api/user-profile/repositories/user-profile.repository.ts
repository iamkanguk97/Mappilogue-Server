import { CustomRepository } from 'src/modules/core/custom-repository/decorators';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserProfileRepository extends Repository<UserEntity> {}
