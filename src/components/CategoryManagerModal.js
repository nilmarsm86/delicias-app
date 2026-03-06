// src/components/CategoryManagerModal.js
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
  success: "#2ECC71",
  warning: "#F39C12",
  error: "#E74C3C",
  text: "#2C3E50",
  textLight: "#95A5A6",
  background: "#F7F7F7",
  disabled: "#CCCCCC",
};

const CategoryManagerModal = ({
  visible,
  onClose,
  categories,
  menuItems, // Recibimos los items del menú para verificar dependencias
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#FF6B6B");

  const colorOptions = [
    "#FF6B6B", // Rojo coral
    "#4ECDC4", // Turquesa
    "#FFD93D", // Amarillo
    "#6BCB77", // Verde
    "#4D96FF", // Azul
    "#FF8AAE", // Rosa
    "#B983FF", // Púrpura
    "#94B3FD", // Azul claro
  ];

  const handleAddCategory = () => {
    if (!categoryName.trim()) return;
    onAddCategory(categoryName, categoryColor);
    resetForm();
  };

  const handleUpdateCategory = () => {
    if (!categoryName.trim() || !editingCategory) return;
    onUpdateCategory(editingCategory.id, categoryName, categoryColor);
    resetForm();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryColor(category.color);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryColor("#FF6B6B");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Verificar si una categoría tiene items asociados
  const categoryHasItems = (categoryId) => {
    return menuItems.some((item) => item.categoryId === categoryId);
  };

  const renderCategory = ({ item }) => {
    const hasItems = categoryHasItems(item.id);

    return (
      <View style={styles.categoryRow}>
        <View style={styles.categoryInfo}>
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryName}>{item.name}</Text>
            {hasItems && (
              <Text style={styles.hasItemsText}>
                ({menuItems.filter((i) => i.categoryId === item.id).length}{" "}
                items)
              </Text>
            )}
          </View>
        </View>

        <View style={styles.categoryActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => handleEditCategory(item)}
          >
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: hasItems ? colors.disabled : colors.error },
            ]}
            onPress={() => !hasItems && onDeleteCategory(item.id)}
            disabled={hasItems}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gestionar Categorías</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>
              {editingCategory ? "Editar categoría" : "Nueva categoría"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de la categoría"
              placeholderTextColor={colors.textLight}
              value={categoryName}
              onChangeText={setCategoryName}
            />

            <Text style={styles.colorLabel}>Color:</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    categoryColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => setCategoryColor(color)}
                />
              ))}
            </View>

            <View style={styles.formActions}>
              {editingCategory && (
                <TouchableOpacity
                  style={[
                    styles.formButton,
                    { backgroundColor: colors.textLight },
                  ]}
                  onPress={resetForm}
                >
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.formButton,
                  {
                    backgroundColor: editingCategory
                      ? colors.warning
                      : colors.success,
                  },
                ]}
                onPress={
                  editingCategory ? handleUpdateCategory : handleAddCategory
                }
                disabled={!categoryName.trim()}
              >
                <Text style={styles.formButtonText}>
                  {editingCategory ? "Actualizar" : "Agregar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Categorías existentes:</Text>
            <FlatList
              data={categories.filter((c) => c.isActive)}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay categorías creadas</Text>
              }
              showsVerticalScrollIndicator={false}
            />

            {/* Leyenda para el usuario */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.secondary },
                  ]}
                />
                <Text style={styles.legendText}>Editar categoría</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: colors.error }]}
                />
                <Text style={styles.legendText}>Eliminar (solo sin items)</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.disabled },
                  ]}
                />
                <Text style={styles.legendText}>
                  No se puede eliminar (tiene items)
                </Text>
              </View>
            </View>
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
  formContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
    color: "#2C3E50",
  },
  colorLabel: {
    fontSize: 14,
    color: "#2C3E50",
    marginBottom: 10,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColorOption: {
    borderColor: "#333",
    transform: [{ scale: 1.1 }],
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  formButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 100,
    alignItems: "center",
  },
  formButtonText: {
    color: "white",
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
    maxHeight: 300,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    color: "#2C3E50",
  },
  hasItemsText: {
    fontSize: 11,
    color: "#95A5A6",
    marginTop: 2,
  },
  categoryActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#95A5A6",
    padding: 20,
  },
  legendContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#2C3E50",
  },
});

export default CategoryManagerModal;
