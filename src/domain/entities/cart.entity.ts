import { CommonEntity } from '@common/database';
import { User } from '@domain/user/user.entity';

export class Cart extends CommonEntity {
  user: User;
}
