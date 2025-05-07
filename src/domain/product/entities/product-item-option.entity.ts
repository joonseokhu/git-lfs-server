import { CommonEntity, ManyToOne, OneToMany } from '@common/database';
import { Column } from 'typeorm';
import { ProductItemInventory } from './product-item-inventory.entity';
import { ProductItem } from './product-item.entity';
import { Product } from './product.entity';

export class ProductItemOption extends CommonEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => ProductItem)
  productItem: ProductItem;

  @OneToMany(
    () => ProductItemInventory,
    (inventory) => inventory.productItemOption,
  )
  inventories: ProductItemInventory[] = [];

  @Column({ nullable: true })
  originalPrice?: number;

  @Column()
  tax: number;

  @Column()
  salePrice: number;

  @Column({ nullable: true })
  maxQuantity?: number;
}
