// src/screens/HomeScreen.js
import React, { useState, useEffect } from "react";
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
import Sale from "../models/Sale";
import MenuItemCard from "../components/MenuItemCard";
import { CategoryFilterWithData } from "../components/CategoryFilter";
import DatePicker from "../components/DatePicker";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { getTodayDate, formatDate } from "../utils/dateUtils";

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  background: "#F7F7F7",
  surface: "#FFFFFF",
  text: "#2C3E50",
  textLight: "#95A5A6",
  success: "#2ECC71",
  error: "#E74C3C",
};

const HomeScreen = ({ menuItems, allSales, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quantities, setQuantities] = useState({});
  const [salesForSelectedDate, setSalesForSelectedDate] = useState([]);
  const { toastState, showToast, hideToast } = useToast();

  // Cargar ventas de la fecha seleccionada
  useEffect(() => {
    loadSalesForDate();
  }, [selectedDate, allSales]);

  const loadSalesForDate = () => {
    // Crear fecha al inicio del día para comparar
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    const dateTime = date.getTime();

    // Filtrar ventas de la fecha seleccionada
    const salesForDate = allSales.filter((sale) => {
      const saleDate = new Date(sale.saleDate);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === dateTime;
    });

    setSalesForSelectedDate(salesForDate);

    // Inicializar cantidades desde las ventas existentes
    const initialQuantities = {};
    salesForDate.forEach((sale) => {
      initialQuantities[sale.menuItemId] = sale.quantity;
    });
    setQuantities(initialQuantities);
  };

  const updateQuantity = (itemId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };

  const saveSales = async () => {
    // Verificar que no sea fecha futura
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay > today) {
      showToast("No puedes guardar ventas en fechas futuras", "error");
      return;
    }

    const selectedDateTime = selectedDay.getTime();

    try {
      await write(async () => {
        const salesCollection = getCollection("sales");

        // Eliminar ventas existentes para esta fecha
        for (const itemId of Object.keys(quantities)) {
          const existingSales = await salesCollection
            .query(
              Q.where("menu_item_id", itemId),
              Q.where("sale_date", selectedDateTime),
            )
            .fetch();

          for (const sale of existingSales) {
            await sale.destroyPermanently();
          }

          // Crear nueva venta si hay cantidad
          if (quantities[itemId] > 0) {
            await salesCollection.create((sale) => {
              sale.menuItemId = itemId;
              sale.quantity = quantities[itemId];
              sale.saleDate = selectedDateTime;
            });
          }
        }
      });

      showToast(
        `¡Ventas guardadas para el ${formatDate(selectedDateTime)}! ✨`,
        "success",
      );
    } catch (error) {
      console.error("Error guardando ventas:", error);
      showToast("Error al guardar las ventas", "error");
    }
  };

  // Función para reiniciar todos los contadores manualmente
  const resetAllCounters = () => {
    setQuantities({});
    showToast("Contadores reiniciados 🔄", "info");
  };

  // Verificar si la fecha seleccionada es futura
  const isFutureDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  // Filtrar items según categoría seleccionada y SOLO activos
  const filteredItems = menuItems.filter((item) => {
    // Solo mostrar items activos
    if (!item.isActive) return false;

    // Filtrar por categoría si no es 'all'
    if (selectedCategory === "all") return true;
    return item.categoryId === selectedCategory;
  });

  // Calcular total de items para la fecha seleccionada
  const totalItemsSelectedDate = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  // Obtener nombre de categoría para mostrar
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Sin categoría";
  };

  // Obtener color de categoría
  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.color : colors.primary;
  };

  const isFuture = isFutureDate();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.title}>LAS DELICIAS DEL CERDO</Text>
        <Text style={styles.subtitle}>"Srta Melis"</Text>
      </View>

      {/* Selector de fecha */}
      <View style={styles.dateSection}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Fecha:</Text>
          <View style={styles.datePickerContainer}>
            <DatePicker
              value={selectedDate}
              onChange={(event, date) => date && setSelectedDate(date)}
              maximumDate={new Date()} // No permitir fechas futuras
            />
          </View>
        </View>
        {isFuture && (
          <Text style={styles.warningText}>
            ⚠️ No se pueden guardar ventas futuras
          </Text>
        )}
      </View>

      {/* CategoryFilter con datos de la base de datos */}
      <CategoryFilterWithData
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        variant="compact"
        showAllOption={true}
      />

      <ScrollView style={styles.menuContainer}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              {selectedCategory === "all"
                ? "No hay items activos en el menú"
                : "No hay items activos en esta categoría"}
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={quantities[item.id] || 0}
              onIncrement={() => updateQuantity(item.id, 1)}
              onDecrement={() => updateQuantity(item.id, -1)}
              colors={colors}
              categoryName={getCategoryName(item.categoryId)}
              categoryColor={getCategoryColor(item.categoryId)}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        {/* Fila superior con total */}
        <View style={styles.statsRow}>
          <Text style={styles.totalToday}>
            Total para {formatDate(selectedDate.getTime())}:{" "}
            <Text style={styles.totalTodayValue}>{totalItemsSelectedDate}</Text>{" "}
            items
          </Text>
        </View>

        {/* Fila de botones: Guardar y Reiniciar lado a lado */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary },
              (totalItemsSelectedDate === 0 || isFuture) &&
                styles.buttonDisabled,
            ]}
            onPress={saveSales}
            disabled={totalItemsSelectedDate === 0 || isFuture}
          >
            <Text
              style={[
                styles.buttonText,
                (totalItemsSelectedDate === 0 || isFuture) &&
                  styles.buttonTextDisabled,
              ]}
            >
              📝 Guardar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: colors.secondary }]}
            onPress={resetAllCounters}
          >
            <Text style={styles.buttonText}>🔄 Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        onHide={hideToast}
        colors={colors}
      />
    </View>
  );
};

const enhance = withObservables([], () => ({
  // Solo obtener items activos para HomeScreen
  menuItems: database.collections
    .get("menu_items")
    .query(Q.where("is_active", true))
    .observe(),
  // Obtener todas las ventas para poder filtrar por fecha
  allSales: database.collections.get("sales").query().observe(),
  categories: database.collections
    .get("categories")
    .query(Q.where("is_active", true))
    .observe(),
}));

export default enhance(HomeScreen);

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
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
    fontStyle: "italic",
    opacity: 0.95,
  },
  dateSection: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    width: 60,
  },
  datePickerContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  warningText: {
    color: "#E74C3C",
    fontSize: 12,
    marginTop: 5,
    fontStyle: "italic",
  },
  menuContainer: {
    flex: 1,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  totalToday: {
    fontSize: 16,
    color: "#2C3E50",
  },
  totalTodayValue: {
    fontWeight: "bold",
    color: "#FF6B6B",
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  saveButton: {
    flex: 2,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  resetButton: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    opacity: 0.8,
  },
});
