import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CategoryBreakdown = ({ data, colors }) => {
  if (!data || data.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={styles.title}>📊 Desglose por Categoría</Text>

      {data.map((category, index) => (
        <View key={category.name} style={styles.categoryRow}>
          <View style={styles.categoryHeader}>
            <Text style={[styles.categoryName, { color: category.color }]}>
              {category.name}
            </Text>
            <Text style={styles.categoryStats}>
              {category.quantity} uds | ${category.revenue.toFixed(2)}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                },
              ]}
            />
          </View>

          <Text style={styles.percentageText}>{category.percentage}%</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  categoryRow: {
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryStats: {
    fontSize: 12,
    color: "#95A5A6",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 2,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 11,
    color: "#95A5A6",
    textAlign: "right",
  },
});

export default CategoryBreakdown;
