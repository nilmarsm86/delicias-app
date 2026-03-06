// src/components/ExpenseFormModal.js
import React, { useState, useEffect } from "react";
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
import DatePicker from "./DatePicker";

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  text: "#2C3E50",
  textLight: "#95A5A6",
  success: "#2ECC71",
  warning: "#F39C12",
};

const ExpenseFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date());

  // Categorías predefinidas para gastos
  const expenseCategories = [
    "Insumos",
    "Proveedores",
    "Servicios",
    "Mantenimiento",
    "Publicidad",
    "Otros",
  ];

  useEffect(() => {
    if (initialData) {
      // Si hay datos iniciales, es modo edición
      setName(initialData.name || "");
      setPrice(initialData.price?.toString() || "");
      setQuantity(initialData.quantity?.toString() || "1");
      setCategory(initialData.category || "");
      setNotes(initialData.notes || "");
      setExpenseDate(
        initialData.expenseDate
          ? new Date(initialData.expenseDate)
          : new Date(),
      );
    } else {
      // Modo creación: resetear campos
      resetForm();
    }
  }, [initialData, visible]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("1");
    setCategory("");
    setNotes("");
    setExpenseDate(new Date());
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("El nombre del gasto es requerido");
      return;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      alert("El precio debe ser un número válido mayor a 0");
      return;
    }
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      alert("La cantidad debe ser un número entero válido mayor a 0");
      return;
    }
    if (!category) {
      alert("Debes seleccionar una categoría");
      return;
    }

    const total = parseFloat(price) * parseInt(quantity);

    onSubmit({
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      total,
      category,
      notes: notes.trim(),
      expenseDate: expenseDate.getTime(),
    });

    resetForm();
  };

  const calculateTotal = () => {
    const priceNum = parseFloat(price) || 0;
    const qtyNum = parseInt(quantity) || 0;
    return (priceNum * qtyNum).toFixed(2);
  };

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
              {initialData ? "✏️ Editar Gasto" : "➕ Registrar Gasto"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Nombre del gasto *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Carne para hamburguesas"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
            />

            <View style={styles.row}>
              <View style={styles.halfColumn}>
                <Text style={styles.label}>Precio unitario *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.textLight}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfColumn}>
                <Text style={styles.label}>Cantidad *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  placeholderTextColor={colors.textLight}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${calculateTotal()}</Text>
            </View>

            <Text style={styles.label}>Categoría *</Text>
            <View style={styles.categorySelector}>
              {expenseCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: "#f0f0f0" },
                    category === cat && { backgroundColor: colors.secondary },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: colors.text },
                      category === cat && { color: "white" },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Fecha del gasto</Text>
            <View style={styles.datePickerContainer}>
              <DatePicker
                value={expenseDate}
                onChange={(event, date) => date && setExpenseDate(date)}
                maximumDate={new Date()}
              />
            </View>

            <Text style={styles.label}>Notas (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalles adicionales..."
              placeholderTextColor={colors.textLight}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
                  backgroundColor: initialData
                    ? colors.warning
                    : colors.success,
                },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {initialData ? "Actualizar" : "Guardar"}
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
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
    color: "#2C3E50",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfColumn: {
    flex: 1,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  datePickerContainer: {
    marginBottom: 15,
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

export default ExpenseFormModal;
