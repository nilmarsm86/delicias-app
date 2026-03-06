import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DatePicker from "./DatePicker";

const DateRangeSelector = ({ startDate, endDate, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dateRow}>
        <Text style={styles.label}>Desde:</Text>
        <View style={styles.picker}>
          <DatePicker
            value={startDate}
            onChange={(event, date) => onChange(date, endDate)}
          />
        </View>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.label}>Hasta:</Text>
        <View style={styles.picker}>
          <DatePicker
            value={endDate}
            onChange={(event, date) => onChange(startDate, date)}
          />
        </View>
      </View>

      <View style={styles.quickButtons}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            onChange(sevenDaysAgo, today);
          }}
        >
          <Text style={styles.quickButtonText}>7d</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => {
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            onChange(thirtyDaysAgo, today);
          }}
        >
          <Text style={styles.quickButtonText}>30d</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            onChange(firstDay, today);
          }}
        >
          <Text style={styles.quickButtonText}>Mes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    width: 50,
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  picker: {
    flex: 1,
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  quickButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  quickButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default DateRangeSelector;
