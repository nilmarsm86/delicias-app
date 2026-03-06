// src/components/MenuItemCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const MenuItemCard = ({
  item,
  quantity,
  onIncrement,
  onDecrement,
  colors,
  categoryName,
  categoryColor,
}) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        {categoryName && (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: (categoryColor || colors.primary) + "20" },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: categoryColor || colors.primary },
              ]}
            >
              {categoryName}
            </Text>
          </View>
        )}
        <Text style={[styles.price, { color: colors.primary }]}>
          ${item.price?.toFixed(2)}
        </Text>
      </View>

      <View style={styles.quantityControl}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            { backgroundColor: colors.primary + "20" },
          ]}
          onPress={onDecrement}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>−</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.quantityContainer,
            { backgroundColor: colors.secondary + "20" },
          ]}
        >
          <Text style={[styles.quantity, { color: colors.text }]}>
            {quantity}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.quantityButton,
            { backgroundColor: colors.secondary + "20" },
          ]}
          onPress={onIncrement}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  quantityContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 10,
    minWidth: 40,
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MenuItemCard;
