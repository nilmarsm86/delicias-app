// src/models/Category.js
import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'categories';

  static associations = {
    menu_items: { type: 'has_many', foreignKey: 'category_id' },
  };

  @text('name') name;
  @text('color') color;
  @field('is_active') isActive;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @children('menu_items') menuItems;
}