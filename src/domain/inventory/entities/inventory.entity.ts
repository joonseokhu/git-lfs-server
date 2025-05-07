import { CommonEntity } from '@common/database';

export class Inventory extends CommonEntity {
  title: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
}
