import { CommonEntity, ManyToOne } from '@common/database';
import { Column } from 'typeorm';
import { Product } from './product.entity';

export class ProductItem extends CommonEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ nullable: true })
  minQuantity?: number;

  @Column({ nullable: true })
  maxQuantity?: number;

  multiple: boolean = false;
}
