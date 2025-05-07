import { CommonEntity } from '@common/database';

export class Product extends CommonEntity {
  title: string;
  description: string;
  price: number;
  tax: number;
}
