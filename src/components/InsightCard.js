import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InsightCard = ({ insight, colors }) => {
  if (!insight) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.secondary + "20" }]}
    >
      <Text style={styles.emoji}>💡</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Insight del día</Text>
        <Text style={styles.insight}>{insight}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  insight: {
    fontSize: 13,
    color: "#2C3E50",
    lineHeight: 18,
  },
});

export default InsightCard;
