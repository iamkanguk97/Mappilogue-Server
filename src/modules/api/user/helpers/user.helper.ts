import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import * as _ from 'lodash';
import { StatusColumn } from 'src/constants';

@Injectable()
export class UserHelper {
  isUserValidWithModel(user: UserEntity): boolean {
    return !_.isNil(user) && user.status !== StatusColumn.DELETED;
  }
}
