// src/database/schema.js
import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 3, // Incrementar versión
  tables: [
    tableSchema({
      name: "categories",
      columns: [
        { name: "name", type: "string" },
        { name: "color", type: "string" },
        { name: "is_active", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "menu_items",
      columns: [
        { name: "name", type: "string" },
        { name: "category_id", type: "string" },
        { name: "price", type: "number" },
        { name: "is_active", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "sales",
      columns: [
        { name: "menu_item_id", type: "string" },
        { name: "quantity", type: "number" },
        { name: "sale_date", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "expenses",
      columns: [
        { name: "name", type: "string" },
        { name: "price", type: "number" },
        { name: "quantity", type: "number" },
        { name: "total", type: "number" },
        { name: "category", type: "string" },
        { name: "notes", type: "string", isOptional: true },
        { name: "expense_date", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
