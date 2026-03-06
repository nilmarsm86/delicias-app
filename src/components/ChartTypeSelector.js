import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ChartTypeSelector = ({ selectedType, onSelect }) => {
  const types = [
    { id: "line", icon: "📈", label: "Líneas" },
    { id: "bar", icon: "📊", label: "Barras" },
    { id: "pie", icon: "🥧", label: "Pastel" },
  ];

  return (
    <View style={styles.container}>
      {types.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.button,
            selectedType === type.id && styles.selectedButton,
          ]}
          onPress={() => onSelect(type.id)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedType === type.id && styles.selectedButtonText,
            ]}
          >
            {type.icon} {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    marginTop: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    fontSize: 12,
    color: "#2C3E50",
  },
  selectedButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ChartTypeSelector;
