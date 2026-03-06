import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class Sale extends Model {
  static table = 'sales';

  static associations = {
    menu_items: { type: 'belongs_to', key: 'menu_item_id' },
  };

  @field('menu_item_id') menuItemId;
  @field('quantity') quantity;
  @date('sale_date') saleDate;
  
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('menu_items', 'menu_item_id') menuItem;
}