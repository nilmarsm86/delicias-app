// src/components/ItemSelector.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ItemSelectorModal from "./ItemSelectorModal";

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  text: "#2C3E50",
  textLight: "#95A5A6",
};

const ItemSelector = ({
  items,
  selectedItemId,
  onSelectItem,
  categoryName,
  placeholder = "Seleccionar item...",
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find((item) => item.id === selectedItemId);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selectedItem ? selectedItem.name : placeholder}
        </Text>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>

      <ItemSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        items={items}
        selectedItemId={selectedItemId}
        onSelectItem={onSelectItem}
        categoryName={categoryName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },
  selectorText: {
    fontSize: 15,
    color: "#2C3E50",
    flex: 1,
  },
  arrowIcon: {
    fontSize: 12,
    color: "#95A5A6",
    marginLeft: 10,
  },
});

export default ItemSelector;
