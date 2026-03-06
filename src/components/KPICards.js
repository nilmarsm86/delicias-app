import React from "react";
import { View, Text, StyleSheet } from "react-native";

const KPICards = ({ totalItems, totalRevenue, averagePerDay, colors }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={styles.cardValue}>{totalItems}</Text>
        <Text style={styles.cardLabel}>Total Items</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={styles.cardValue}>${totalRevenue.toFixed(2)}</Text>
        <Text style={styles.cardLabel}>Ingresos</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={styles.cardValue}>{averagePerDay}</Text>
        <Text style={styles.cardLabel}>Promedio/día</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    marginTop: -10,
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 11,
    color: "#95A5A6",
    textAlign: "center",
  },
});

export default KPICards;
