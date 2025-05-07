import { CommonEntity } from '@common/database';
import { Entity } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  name: string;

  birthDate: Date;
}
