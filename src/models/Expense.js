// src/models/Expense.js
import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly } from "@nozbe/watermelondb/decorators";

export default class Expense extends Model {
  static table = "expenses";

  @text("name") name; // Nombre del gasto (ej: "Carne para hamburguesas")
  @field("price") price; // Precio por unidad
  @field("quantity") quantity; // Cantidad comprada
  @field("total") total; // Precio total (price * quantity)
  @text("category") category; // Categoría del gasto (ej: "Insumos", "Proveedores")
  @text("notes") notes; // Notas adicionales
  @date("expense_date") expenseDate; // Fecha del gasto
  @readonly @date("created_at") createdAt;
  @readonly @date("updated_at") updatedAt;
}
