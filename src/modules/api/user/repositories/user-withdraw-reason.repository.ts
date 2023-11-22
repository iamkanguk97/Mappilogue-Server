import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { UserWithdrawReasonEntity } from '../entities/user-withdraw-reason.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserWithdrawReasonEntity)
export class UserWithdrawReasonRepository extends Repository<UserWithdrawReasonEntity> {}
