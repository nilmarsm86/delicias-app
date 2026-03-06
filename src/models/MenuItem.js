// src/models/MenuItem.js
import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class MenuItem extends Model {
  static table = 'menu_items';

  static associations = {
    sales: { type: 'has_many', foreignKey: 'menu_item_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
  };

  @text('name') name;
  @field('category_id') categoryId;
  @field('price') price;
  @field('is_active') isActive;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('categories', 'category_id') category;
}