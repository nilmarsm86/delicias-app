// src/components/ExpenseCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { formatDate } from "../utils/dateUtils";

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  text: "#2C3E50",
  textLight: "#95A5A6",
  success: "#2ECC71",
  warning: "#F39C12",
  error: "#E74C3C",
};

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Insumos: "#4ECDC4",
      Proveedores: "#FF6B6B",
      Servicios: "#FFD93D",
      Mantenimiento: "#6BCB77",
      Publicidad: "#4D96FF",
      Otros: "#95A5A6",
    };
    return colors[category] || colors["Otros"];
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{expense.name}</Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(expense.category) + "20" },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(expense.category) },
              ]}
            >
              {expense.category}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>{formatDate(expense.expenseDate)}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Precio unitario:</Text>
          <Text style={styles.detailValue}>${expense.price.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cantidad:</Text>
          <Text style={styles.detailValue}>{expense.quantity} unidades</Text>
        </View>
        <View style={[styles.detailRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${expense.total.toFixed(2)}</Text>
        </View>
      </View>

      {expense.notes ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notas:</Text>
          <Text style={styles.notesText}>{expense.notes}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          onPress={() => onEdit(expense)}
        >
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={() => onDelete(expense)}
        >
          <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#95A5A6",
  },
  details: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 13,
    color: "#95A5A6",
  },
  detailValue: {
    fontSize: 13,
    color: "#2C3E50",
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  notesContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: "#2C3E50",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
});

export default ExpenseCard;
