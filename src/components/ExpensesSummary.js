// src/components/ExpensesSummary.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  text: "#2C3E50",
  textLight: "#95A5A6",
  success: "#2ECC71",
};

const ExpensesSummary = ({ expenses }) => {
  // Calcular total general
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.total, 0);

  // Agrupar por categoría
  const expensesByCategory = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = {
        total: 0,
        count: 0,
      };
    }
    acc[exp.category].total += exp.total;
    acc[exp.category].count += 1;
    return acc;
  }, {});

  // Ordenar categorías por total descendente
  const sortedCategories = Object.entries(expensesByCategory).sort(
    ([, a], [, b]) => b.total - a.total,
  );

  return (
    <View style={styles.container}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Gastos</Text>
        <Text style={styles.totalValue}>${totalExpenses.toFixed(2)}</Text>
        <Text style={styles.totalCount}>{expenses.length} registros</Text>
      </View>

      {sortedCategories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Resumen por categoría:</Text>
          {sortedCategories.map(([category, data]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryCount}>
                  ({data.count} registros)
                </Text>
              </View>
              <Text style={styles.categoryTotal}>${data.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  totalCard: {
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: "#95A5A6",
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 5,
  },
  totalCount: {
    fontSize: 12,
    color: "#95A5A6",
  },
  categoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryName: {
    fontSize: 14,
    color: "#2C3E50",
  },
  categoryCount: {
    fontSize: 11,
    color: "#95A5A6",
  },
  categoryTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
});

export default ExpensesSummary;
