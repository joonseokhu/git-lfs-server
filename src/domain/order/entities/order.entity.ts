import { CommonEntity } from '@common/database';
import { User } from '@domain/user/user.entity';

export class Order extends CommonEntity {
  user: User;
}
