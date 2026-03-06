// src/database/migrations.js
import {
  schemaMigrations,
  createTable,
  addColumns,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: "categories",
          columns: [
            { name: "name", type: "string" },
            { name: "color", type: "string" },
            { name: "is_active", type: "boolean" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        addColumns({
          table: "menu_items",
          columns: [{ name: "category_id", type: "string", isOptional: true }],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        createTable({
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
    },
  ],
});
