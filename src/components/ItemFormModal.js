// src/components/ItemFormModal.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  text: "#2C3E50",
  textLight: "#95A5A6",
  success: "#2ECC71",
  warning: "#F39C12",
};

const ItemFormModal = ({
  visible,
  onClose,
  onSubmit,
  itemName,
  onItemNameChange,
  itemPrice,
  onItemPriceChange,
  selectedCategoryId,
  categories,
  onCategoryChange,
  isEditing = false,
}) => {
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
              {isEditing ? "✏️ Editar Item" : "➕ Agregar Nuevo Item"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Nombre del item *</Text>
            <TextInput
              testID="itemNameInput"
              style={styles.input}
              placeholder="Ej: Hamburguesa Clásica"
              placeholderTextColor={colors.textLight}
              value={itemName}
              onChangeText={onItemNameChange}
              autoFocus
            />

            <Text style={styles.label}>Precio *</Text>
            <TextInput
              testID="itemPriceInput"
              style={styles.input}
              placeholder="Ej: 12.99"
              placeholderTextColor={colors.textLight}
              value={itemPrice}
              onChangeText={onItemPriceChange}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Categoría *</Text>
            <View style={styles.categorySelector}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: "#f0f0f0" },
                    selectedCategoryId === cat.id && {
                      backgroundColor: cat.color || colors.primary,
                    },
                  ]}
                  onPress={() => onCategoryChange(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: colors.text },
                      selectedCategoryId === cat.id && { color: "white" },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor: isEditing ? colors.warning : colors.success,
                },
              ]}
              onPress={onSubmit}
            >
              <Text style={styles.submitButtonText}>
                {isEditing ? "Actualizar" : "Agregar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: Platform.OS === "web" ? 500 : "90%",
    maxWidth: 500,
    maxHeight: "80%",
    ...Platform.select({
      web: {
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
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
    fontSize: 20,
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
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
    color: "#2C3E50",
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#2C3E50",
    fontWeight: "600",
    fontSize: 14,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ItemFormModal;
