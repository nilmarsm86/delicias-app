// src/screens/AdminScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import { database, write, getCollection } from "../database";
import MenuItem from "../models/MenuItem";
import Category from "../models/Category";
import Expense from "../models/Expense";
import { CategoryFilterWithData } from "../components/CategoryFilter";
import ItemFormModal from "../components/ItemFormModal";
import CategoryManagerModal from "../components/CategoryManagerModal";
import ExpenseFormModal from "../components/ExpenseFormModal";
import ExpenseCard from "../components/ExpenseCard";
import ExpensesSummary from "../components/ExpensesSummary";
import Alert from "../components/Alert";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAlert } from "../hooks/useAlert";
import { useToast } from "../hooks/useToast";
import { useConfirm } from "../hooks/useConfirm";

// Paleta de colores
const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFE66D",
  background: "#F7F7F7",
  surface: "#FFFFFF",
  text: "#2C3E50",
  textLight: "#95A5A6",
  success: "#2ECC71",
  warning: "#F39C12",
  error: "#E74C3C",
};

const AdminScreen = ({ menuItems, categories, expenses }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // Estados para secciones colapsables
  const [activeSectionExpanded, setActiveSectionExpanded] = useState(true);
  const [inactiveSectionExpanded, setInactiveSectionExpanded] = useState(true);
  const [expensesSectionExpanded, setExpensesSectionExpanded] = useState(true);

  // Estado del formulario de items
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: null,
  });

  const { alertState, showAlert, hideAlert } = useAlert();
  const { toastState, showToast, hideToast } = useToast();
  const { confirmState, showConfirm, hideConfirm } = useConfirm();

  // Obtener categorías activas
  const activeCategories = categories.filter((c) => c.isActive);

  // Cuando se selecciona una categoría en el filtro
  const handleCategorySelect = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Obtener objeto de categoría seleccionada
  const getSelectedCategoryObject = () => {
    if (!selectedCategory) return null;
    return categories.find((c) => c.id === selectedCategory);
  };

  // Abrir modal para agregar item con categoría preseleccionada
  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      categoryId: selectedCategory || activeCategories[0]?.id || null,
    });
    setModalVisible(true);
  };

  // Abrir modal para editar item
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      categoryId: item.categoryId,
    });
    setModalVisible(true);
  };

  // Abrir modal para agregar gasto
  const openAddExpenseModal = () => {
    setEditingExpense(null);
    setExpenseModalVisible(true);
  };

  // Abrir modal para editar gasto
  const openEditExpenseModal = (expense) => {
    setEditingExpense(expense);
    setExpenseModalVisible(true);
  };

  // Cerrar modal de items
  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  // Cerrar modal de gastos
  const closeExpenseModal = () => {
    setExpenseModalVisible(false);
    setEditingExpense(null);
  };

  // Guardar item (nuevo o editado)
  const handleSubmitItem = async () => {
    if (!formData.name.trim()) {
      showAlert({
        title: "¡Oops!",
        message: "El nombre del item es requerido",
        confirmText: "OK",
      });
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      showAlert({
        title: "¡Oops!",
        message: "El precio debe ser un número válido",
        confirmText: "OK",
      });
      return;
    }

    if (!formData.categoryId) {
      showAlert({
        title: "¡Oops!",
        message: "Debes seleccionar una categoría",
        confirmText: "OK",
      });
      return;
    }

    try {
      await write(async () => {
        const menuCollection = getCollection("menu_items");

        if (editingItem) {
          // Actualizar item existente
          await editingItem.update((item) => {
            item.name = formData.name;
            item.price = parseFloat(formData.price);
            item.categoryId = formData.categoryId;
          });
          showToast("¡Item actualizado! ✨", "success");
        } else {
          // Crear nuevo item
          await menuCollection.create((item) => {
            item.name = formData.name;
            item.price = parseFloat(formData.price);
            item.categoryId = formData.categoryId;
            item.isActive = true;
          });
          showToast("¡Item agregado! 🎉", "success");
        }
      });

      closeModal();
    } catch (error) {
      console.error("Error guardando item:", error);
      showToast("Error al guardar el item", "error");
    }
  };

  // Guardar gasto (nuevo o editado)
  const handleSubmitExpense = async (expenseData) => {
    try {
      await write(async () => {
        const expenseCollection = getCollection("expenses");

        if (editingExpense) {
          // Actualizar gasto existente
          await editingExpense.update((expense) => {
            expense.name = expenseData.name;
            expense.price = expenseData.price;
            expense.quantity = expenseData.quantity;
            expense.total = expenseData.total;
            expense.category = expenseData.category;
            expense.notes = expenseData.notes;
            expense.expenseDate = expenseData.expenseDate;
          });
          showToast("¡Gasto actualizado! ✨", "success");
        } else {
          // Crear nuevo gasto
          await expenseCollection.create((expense) => {
            expense.name = expenseData.name;
            expense.price = expenseData.price;
            expense.quantity = expenseData.quantity;
            expense.total = expenseData.total;
            expense.category = expenseData.category;
            expense.notes = expenseData.notes;
            expense.expenseDate = expenseData.expenseDate;
          });
          showToast("¡Gasto registrado! 💰", "success");
        }
      });

      closeExpenseModal();
    } catch (error) {
      console.error("Error guardando gasto:", error);
      showToast("Error al guardar el gasto", "error");
    }
  };

  // Eliminar gasto
  const deleteExpense = async (expense) => {
    const confirmed = await showConfirm({
      title: "Eliminar gasto",
      message: `¿Estás seguro que deseas eliminar "${expense.name}"?`,
    });

    if (confirmed) {
      try {
        await write(async () => {
          await expense.destroyPermanently();
        });
        showToast("Gasto eliminado 🗑️", "success");
      } catch (error) {
        console.error("Error eliminando gasto:", error);
        showToast("Error al eliminar el gasto", "error");
      }
    }
  };

  // Activar/Desactivar item
  const toggleItemActive = async (item) => {
    const action = item.isActive ? "desactivar" : "activar";

    const confirmed = await showConfirm({
      title: `¿${action} item?`,
      message: `¿Estás seguro que deseas ${action} "${item.name}"?`,
    });

    if (confirmed) {
      try {
        await write(async () => {
          await item.update((i) => {
            i.isActive = !i.isActive;
          });
        });
        showToast(`Item ${action}do ✨`, "success");
      } catch (error) {
        console.error("Error actualizando item:", error);
        showToast("Error al actualizar el item", "error");
      }
    }
  };

  // Eliminar item permanentemente
  const deleteMenuItem = async (item) => {
    const confirmed = await showConfirm({
      title: "Eliminar item",
      message: `¿Estás seguro que deseas eliminar "${item.name}" permanentemente?`,
    });

    if (confirmed) {
      try {
        await write(async () => {
          await item.destroyPermanently();
        });
        showToast("Item eliminado 🗑️", "success");
      } catch (error) {
        console.error("Error eliminando item:", error);
        showToast("Error al eliminar el item", "error");
      }
    }
  };

  // Agregar nueva categoría
  const handleAddCategory = async (name, color) => {
    try {
      await write(async () => {
        const categoryCollection = getCollection("categories");
        await categoryCollection.create((category) => {
          category.name = name;
          category.color = color;
          category.isActive = true;
        });
      });
      showToast("¡Categoría agregada! 🎉", "success");
    } catch (error) {
      console.error("Error agregando categoría:", error);
      showToast("Error al agregar categoría", "error");
    }
  };

  // Actualizar categoría existente
  const handleUpdateCategory = async (id, name, color) => {
    try {
      await write(async () => {
        const category = await getCollection("categories").find(id);
        await category.update((c) => {
          c.name = name;
          c.color = color;
        });
      });
      showToast("¡Categoría actualizada! ✨", "success");
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      showToast("Error al actualizar categoría", "error");
    }
  };

  // Eliminar categoría (solo si no tiene items)
  const handleDeleteCategory = async (id) => {
    // Verificar si hay items en esta categoría
    const itemsInCategory = menuItems.filter((item) => item.categoryId === id);

    if (itemsInCategory.length > 0) {
      showAlert({
        title: "No se puede eliminar",
        message: `Esta categoría tiene ${itemsInCategory.length} items. Debes moverlos o eliminarlos primero.`,
        confirmText: "Entendido",
      });
      return;
    }

    const confirmed = await showConfirm({
      title: "Eliminar categoría",
      message: "¿Estás seguro de eliminar esta categoría?",
    });

    if (confirmed) {
      try {
        await write(async () => {
          const category = await getCollection("categories").find(id);
          await category.destroyPermanently();
        });
        showToast("Categoría eliminada 🗑️", "success");

        if (selectedCategory === id) {
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error("Error eliminando categoría:", error);
        showToast("Error al eliminar categoría", "error");
      }
    }
  };

  // Filtrar items según la categoría seleccionada
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.categoryId === selectedCategory)
    : menuItems;

  const activeItems = filteredItems.filter((item) => item.isActive);
  const inactiveItems = filteredItems.filter((item) => !item.isActive);

  // Obtener nombre y color de categoría por ID
  const getCategoryInfo = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category ? category.name : "Sin categoría",
      color: category ? category.color : colors.textLight,
    };
  };

  const selectedCategoryObj = getSelectedCategoryObject();

  // Componente para sección colapsable
  const CollapsibleSection = ({
    title,
    count,
    expanded,
    onToggle,
    children,
    accentColor,
  }) => (
    <View style={styles.collapsibleSection}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <Text
            style={[
              styles.sectionHeaderText,
              { color: accentColor || colors.text },
            ]}
          >
            {title}
          </Text>
          {count !== undefined && (
            <View
              style={[
                styles.countBadge,
                { backgroundColor: accentColor || colors.primary },
              ]}
            >
              <Text style={styles.countBadgeText}>{count}</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionHeaderIcon}>{expanded ? "▼" : "▶"}</Text>
      </TouchableOpacity>

      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>
          Gestiona el menú de "Las Delicias del Cerdo"
        </Text>
      </View>

      {/* Botones de acción principales */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.success }]}
          onPress={openAddModal}
        >
          <Text style={styles.actionButtonText}>➕ Agregar Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>🏷️ Categorías</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.warning }]}
          onPress={openAddExpenseModal}
        >
          <Text style={styles.actionButtonText}>💰 Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro por categoría para items */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filtrar items por categoría:</Text>
        <CategoryFilterWithData
          selectedCategory={selectedCategory || "all"}
          onSelectCategory={handleCategorySelect}
          variant="full"
          showAllOption={true}
        />
      </View>

      {/* Sección de Gastos */}
      {expenses.length > 0 && (
        <CollapsibleSection
          title="Gastos"
          count={expenses.length}
          expanded={expensesSectionExpanded}
          onToggle={() => setExpensesSectionExpanded(!expensesSectionExpanded)}
          accentColor={colors.warning}
        >
          <ExpensesSummary expenses={expenses} />
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={openEditExpenseModal}
              onDelete={deleteExpense}
            />
          ))}
        </CollapsibleSection>
      )}

      {/* Items Activos */}
      {activeItems.length > 0 && (
        <CollapsibleSection
          title="Items Activos"
          count={activeItems.length}
          expanded={activeSectionExpanded}
          onToggle={() => setActiveSectionExpanded(!activeSectionExpanded)}
          accentColor={colors.success}
        >
          {activeItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.categoryId);
            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: categoryInfo.color + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          { color: categoryInfo.color },
                        ]}
                      >
                        {categoryInfo.name}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.itemPrice}>
                    ${item.price?.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[
                      styles.itemButton,
                      { backgroundColor: colors.secondary },
                    ]}
                    onPress={() => openEditModal(item)}
                  >
                    <Text style={styles.itemButtonText}>✏️ Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.itemButton,
                      { backgroundColor: colors.warning },
                    ]}
                    onPress={() => toggleItemActive(item)}
                  >
                    <Text style={styles.itemButtonText}>Desactivar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.itemButton,
                      { backgroundColor: colors.error },
                    ]}
                    onPress={() => deleteMenuItem(item)}
                  >
                    <Text style={styles.itemButtonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </CollapsibleSection>
      )}

      {/* Items Inactivos */}
      {inactiveItems.length > 0 && (
        <CollapsibleSection
          title="Items Inactivos"
          count={inactiveItems.length}
          expanded={inactiveSectionExpanded}
          onToggle={() => setInactiveSectionExpanded(!inactiveSectionExpanded)}
          accentColor={colors.warning}
        >
          {inactiveItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.categoryId);
            return (
              <View
                key={item.id}
                style={[styles.itemCard, styles.inactiveItemCard]}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, styles.inactiveItemText]}>
                      {item.name}
                    </Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: categoryInfo.color + "10" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          { color: categoryInfo.color + "80" },
                        ]}
                      >
                        {categoryInfo.name}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.itemPrice, styles.inactiveItemText]}>
                    ${item.price?.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[
                      styles.itemButton,
                      { backgroundColor: colors.secondary },
                    ]}
                    onPress={() => openEditModal(item)}
                  >
                    <Text style={styles.itemButtonText}>✏️ Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.itemButton,
                      { backgroundColor: colors.success },
                    ]}
                    onPress={() => toggleItemActive(item)}
                  >
                    <Text style={styles.itemButtonText}>Activar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.itemButton,
                      { backgroundColor: colors.error },
                    ]}
                    onPress={() => deleteMenuItem(item)}
                  >
                    <Text style={styles.itemButtonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </CollapsibleSection>
      )}

      {/* Mensaje cuando no hay items */}
      {activeItems.length === 0 && inactiveItems.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyText}>
            {selectedCategoryObj
              ? `No hay items en la categoría ${selectedCategoryObj.name}`
              : "No hay items en el menú"}
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={openAddModal}
          >
            <Text style={styles.emptyButtonText}>➕ Agregar primer item</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para agregar/editar items */}
      <ItemFormModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={handleSubmitItem}
        itemName={formData.name}
        onItemNameChange={(text) => setFormData({ ...formData, name: text })}
        itemPrice={formData.price}
        onItemPriceChange={(text) => setFormData({ ...formData, price: text })}
        selectedCategoryId={formData.categoryId}
        categories={activeCategories}
        onCategoryChange={(catId) =>
          setFormData({ ...formData, categoryId: catId })
        }
        isEditing={!!editingItem}
      />

      {/* Modal para gestionar categorías */}
      <CategoryManagerModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        categories={categories}
        menuItems={menuItems}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Modal para gastos */}
      <ExpenseFormModal
        visible={expenseModalVisible}
        onClose={closeExpenseModal}
        onSubmit={handleSubmitExpense}
        initialData={editingExpense}
      />

      <Alert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        onConfirm={alertState.onConfirm || hideAlert}
        onCancel={alertState.onCancel}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        colors={colors}
      />

      <ConfirmDialog
        visible={confirmState.visible}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={confirmState.onCancel}
        colors={colors}
      />

      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        onHide={hideToast}
        colors={colors}
      />
    </ScrollView>
  );
};

const enhance = withObservables([], () => ({
  menuItems: database.collections.get("menu_items").query().observe(),
  categories: database.collections.get("categories").query().observe(),
  expenses: database.collections.get("expenses").query().observe(),
}));

export default enhance(AdminScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    padding: 25,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  filterSection: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },

  // Estilos para secciones colapsables
  collapsibleSection: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  countBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionHeaderIcon: {
    fontSize: 14,
    color: "#95A5A6",
  },
  sectionContent: {
    padding: 15,
  },

  // Estilos para items (sin cambios)
  itemCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  inactiveItemCard: {
    backgroundColor: "#f9f9f9",
    opacity: 0.8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  inactiveItemText: {
    color: "#95A5A6",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  itemButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 4,
  },
  itemButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#95A5A6",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
