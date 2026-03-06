// src/components/ItemSelectorModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from "react-native";

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  text: "#2C3E50",
  textLight: "#95A5A6",
  background: "#F7F7F7",
  surface: "#FFFFFF",
};

const ItemSelectorModal = ({
  visible,
  onClose,
  items,
  selectedItemId,
  onSelectItem,
  categoryName,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemRow,
        selectedItemId === item.id && styles.selectedItemRow,
      ]}
      onPress={() => {
        onSelectItem(item.id);
        onClose();
      }}
    >
      <View style={styles.itemInfo}>
        <Text
          style={[
            styles.itemName,
            selectedItemId === item.id && styles.selectedItemText,
          ]}
        >
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>${item.price?.toFixed(2)}</Text>
      </View>
      {selectedItemId === item.id && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Seleccionar item {categoryName ? `en ${categoryName}` : ""}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar item..."
              placeholderTextColor={colors.textLight}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyText}>No se encontraron items</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    ...Platform.select({
      web: {
        justifyContent: "center",
        alignItems: "center",
      },
    }),
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    ...Platform.select({
      web: {
        width: 500,
        borderRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#95A5A6",
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: "#2C3E50",
  },
  listContainer: {
    padding: 15,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedItemRow: {
    backgroundColor: "#FF6B6B10",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#2C3E50",
    marginBottom: 4,
  },
  selectedItemText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 14,
    color: "#95A5A6",
  },
  checkmark: {
    fontSize: 20,
    color: "#FF6B6B",
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#95A5A6",
    textAlign: "center",
  },
});

export default ItemSelectorModal;
