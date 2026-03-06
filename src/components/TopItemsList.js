import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TopItemsList = ({ items, title, showRevenue = false, colors }) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={styles.title}>{title}</Text>

      {items.map((item, index) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.rankContainer}>
            <Text
              style={[
                styles.rank,
                index === 0 && styles.firstPlace,
                index === 1 && styles.secondPlace,
                index === 2 && styles.thirdPlace,
              ]}
            >
              {index === 0
                ? "🥇"
                : index === 1
                  ? "🥈"
                  : index === 2
                    ? "🥉"
                    : `${index + 1}.`}
            </Text>
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={[styles.itemQuantity, { color: colors.primary }]}>
              {item.quantity} uds
            </Text>
            {showRevenue && (
              <Text style={styles.itemRevenue}>${item.revenue.toFixed(2)}</Text>
            )}
          </View>
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
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rankContainer: {
    width: 35,
  },
  rank: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#95A5A6",
  },
  firstPlace: {
    fontSize: 18,
  },
  secondPlace: {
    fontSize: 16,
  },
  thirdPlace: {
    fontSize: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  itemCategory: {
    fontSize: 11,
    color: "#95A5A6",
    marginTop: 2,
  },
  statsContainer: {
    alignItems: "flex-end",
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemRevenue: {
    fontSize: 11,
    color: "#95A5A6",
    marginTop: 2,
  },
});

export default TopItemsList;
