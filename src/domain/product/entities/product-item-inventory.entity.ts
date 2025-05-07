import { CommonEntity, ManyToOne } from '@common/database';
import { Inventory } from '@domain/inventory/entities/inventory.entity';
import { Column } from 'typeorm';
import { ProductItemOption } from './product-item-option.entity';

export class ProductItemInventory extends CommonEntity {
  @ManyToOne(() => ProductItemOption)
  productItemOption: ProductItemOption;

  @ManyToOne(() => Inventory)
  inventory: Inventory;

  @Column()
  quantity: number = 1;
}
