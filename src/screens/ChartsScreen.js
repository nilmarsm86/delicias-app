// src/screens/ChartsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import DateRangeSelector from "../components/DateRangeSelector";
import KPICards from "../components/KPICards";
import CategoryBreakdown from "../components/CategoryBreakdown";
import TopItemsList from "../components/TopItemsList";
import ChartTypeSelector from "../components/ChartTypeSelector";
import FilterTabs from "../components/FilterTabs";
import InsightCard from "../components/InsightCard";
import ItemSelector from "../components/ItemSelector";
import { CategoryFilterWithData } from "../components/CategoryFilter";
import { formatDate, getDatesInRange } from "../utils/dateUtils";

// Colores para gráficos
const chartColors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFE66D",
  background: "#F7F7F7",
  text: "#2C3E50",
  textLight: "#95A5A6",
  success: "#2ECC71",
  warning: "#F39C12",
  error: "#E74C3C",
};

const ChartsScreen = ({ menuItems, allSales, categories }) => {
  const [activeTab, setActiveTab] = useState("general"); // 'general', 'categories', 'items'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredSales, setFilteredSales] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [insight, setInsight] = useState("");

  const screenWidth = Dimensions.get("window").width - 40;

  // Inicializar con últimos 7 días
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setStartDate(sevenDaysAgo);
    setEndDate(today);
  }, []);

  // Filtrar ventas cuando cambian los filtros
  useEffect(() => {
    filterSalesByDate();
  }, [allSales, startDate, endDate, selectedCategory, selectedItem, activeTab]);

  // Actualizar todos los datos cuando cambian las ventas filtradas
  useEffect(() => {
    if (filteredSales.length > 0) {
      prepareChartData();
      prepareCategoryData();
      prepareTopItems();
      generateInsight();
    } else {
      setChartData(null);
      setCategoryData([]);
      setTopItems([]);
      setInsight("No hay datos para el período seleccionado");
    }
  }, [filteredSales, activeTab, selectedCategory, selectedItem, chartType]);

  const filterSalesByDate = () => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let filtered = allSales.filter((sale) => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= start && saleDate <= end;
    });

    // Aplicar filtros según la pestaña activa
    if (activeTab === "categories" && selectedCategory) {
      // Filtrar por categoría específica
      filtered = filtered.filter((sale) => {
        const menuItem = menuItems.find((item) => item.id === sale.menuItemId);
        return menuItem && menuItem.categoryId === selectedCategory;
      });
    } else if (activeTab === "items" && selectedItem) {
      // Filtrar por item específico
      filtered = filtered.filter((sale) => sale.menuItemId === selectedItem);
    }

    setFilteredSales(filtered);
  };

  const prepareChartData = () => {
    if (chartType === "pie") {
      preparePieChartData();
      return;
    }

    const dates = getDatesInRange(startDate, endDate);
    const labels = dates.map(
      (date) => formatDate(date.getTime()).split(" ")[0],
    );

    let quantities = [];

    if (activeTab === "general") {
      // Ventas totales por día
      quantities = dates.map((date) => {
        const dateStr = date.toDateString();
        const daySales = filteredSales.filter(
          (sale) => new Date(sale.saleDate).toDateString() === dateStr,
        );
        return daySales.reduce((sum, sale) => sum + sale.quantity, 0);
      });
    } else {
      // Ventas filtradas por categoría o item por día
      quantities = dates.map((date) => {
        const dateStr = date.toDateString();
        const daySales = filteredSales.filter(
          (sale) => new Date(sale.saleDate).toDateString() === dateStr,
        );
        return daySales.reduce((sum, sale) => sum + sale.quantity, 0);
      });
    }

    setChartData({
      labels,
      datasets: [
        {
          data: quantities,
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    });
  };

  const preparePieChartData = () => {
    if (activeTab === "categories" && selectedCategory) {
      // Distribución por items dentro de una categoría
      const itemsInCategory = menuItems.filter(
        (item) => item.categoryId === selectedCategory && item.isActive,
      );

      const data = itemsInCategory
        .map((item) => {
          const total = filteredSales
            .filter((sale) => sale.menuItemId === item.id)
            .reduce((sum, sale) => sum + sale.quantity, 0);

          // Buscar el color de la categoría
          const category = categories.find((c) => c.id === selectedCategory);

          return {
            name:
              item.name.length > 15
                ? item.name.substring(0, 15) + "..."
                : item.name,
            quantity: total,
            color: category?.color || getRandomColor(item.id),
            legendFontColor: "#333",
            legendFontSize: 12,
          };
        })
        .filter((item) => item.quantity > 0);

      setChartData(data);
    } else if (activeTab === "items" && selectedItem) {
      // Distribución por días para un item específico
      const dates = getDatesInRange(startDate, endDate);
      const data = dates
        .map((date) => {
          const dateStr = date.toDateString();
          const daySales = filteredSales.filter(
            (sale) => new Date(sale.saleDate).toDateString() === dateStr,
          );
          const total = daySales.reduce((sum, sale) => sum + sale.quantity, 0);

          return {
            name: formatDate(date.getTime()).split(" ")[0],
            quantity: total,
            color: getRandomColor(date.getTime()),
            legendFontColor: "#333",
            legendFontSize: 12,
          };
        })
        .filter((item) => item.quantity > 0);

      setChartData(data);
    } else {
      // Distribución por categorías (vista general)
      const categoriesTotal = {};
      filteredSales.forEach((sale) => {
        const menuItem = menuItems.find((m) => m.id === sale.menuItemId);
        if (menuItem) {
          const category = categories.find((c) => c.id === menuItem.categoryId);
          if (category) {
            categoriesTotal[category.id] =
              (categoriesTotal[category.id] || 0) + sale.quantity;
          }
        }
      });

      const data = Object.entries(categoriesTotal).map(
        ([categoryId, quantity]) => {
          const category = categories.find((c) => c.id === categoryId);
          return {
            name: category?.name || "Sin categoría",
            quantity,
            color: category?.color || chartColors.primary,
            legendFontColor: "#333",
            legendFontSize: 12,
          };
        },
      );

      setChartData(data);
    }
  };

  const prepareCategoryData = () => {
    const categoriesTotal = {};
    const categoriesRevenue = {};

    filteredSales.forEach((sale) => {
      const menuItem = menuItems.find((m) => m.id === sale.menuItemId);
      if (menuItem) {
        const category = categories.find((c) => c.id === menuItem.categoryId);
        if (category) {
          categoriesTotal[category.id] =
            (categoriesTotal[category.id] || 0) + sale.quantity;
          categoriesRevenue[category.id] =
            (categoriesRevenue[category.id] || 0) +
            sale.quantity * menuItem.price;
        }
      }
    });

    const totalItems = filteredSales.reduce(
      (sum, sale) => sum + sale.quantity,
      0,
    );

    const data = categories
      .filter((c) => c.isActive)
      .map((category) => ({
        name: category.name,
        quantity: categoriesTotal[category.id] || 0,
        revenue: categoriesRevenue[category.id] || 0,
        percentage:
          totalItems > 0
            ? Math.round(
                ((categoriesTotal[category.id] || 0) / totalItems) * 100,
              )
            : 0,
        color: category.color || chartColors.primary,
      }))
      .filter((cat) => cat.quantity > 0); // Solo mostrar categorías con ventas

    setCategoryData(data);
  };

  const prepareTopItems = () => {
    const itemSales = {};

    filteredSales.forEach((sale) => {
      itemSales[sale.menuItemId] =
        (itemSales[sale.menuItemId] || 0) + sale.quantity;
    });

    const items = Object.entries(itemSales)
      .map(([id, quantity]) => {
        const item = menuItems.find((m) => m.id === id);
        if (!item) return null;

        const category = categories.find((c) => c.id === item.categoryId);

        return {
          id: item.id,
          name: item.name,
          quantity,
          category: category?.name || "Sin categoría",
          categoryColor: category?.color || chartColors.primary,
          price: item.price,
          revenue: quantity * item.price,
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    setTopItems(items);
  };

  const generateInsight = () => {
    if (filteredSales.length === 0) {
      setInsight("No hay suficientes datos para generar insights");
      return;
    }

    // Encontrar el mejor día
    const salesByDay = {};
    filteredSales.forEach((sale) => {
      const day = new Date(sale.saleDate).toDateString();
      salesByDay[day] = (salesByDay[day] || 0) + sale.quantity;
    });

    let bestDay = null;
    let bestDayQuantity = 0;
    Object.entries(salesByDay).forEach(([day, quantity]) => {
      if (quantity > bestDayQuantity) {
        bestDayQuantity = quantity;
        bestDay = day;
      }
    });

    // Calcular crecimiento vs período anterior
    const midPoint = new Date((startDate.getTime() + endDate.getTime()) / 2);
    const firstHalf = filteredSales.filter(
      (sale) => new Date(sale.saleDate) <= midPoint,
    );
    const secondHalf = filteredSales.filter(
      (sale) => new Date(sale.saleDate) > midPoint,
    );

    const firstHalfTotal = firstHalf.reduce(
      (sum, sale) => sum + sale.quantity,
      0,
    );
    const secondHalfTotal = secondHalf.reduce(
      (sum, sale) => sum + sale.quantity,
      0,
    );

    const growth =
      firstHalfTotal > 0
        ? Math.round(
            ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100,
          )
        : 0;

    // Generar mensaje de insight
    if (topItems.length > 0) {
      const topItem = topItems[0];
      const bestDayFormatted = bestDay
        ? new Date(bestDay).toLocaleDateString()
        : "desconocido";

      let insightMessage = `✨ El item más vendido es "${topItem.name}" con ${topItem.quantity} unidades. `;
      insightMessage += `El mejor día fue ${bestDayFormatted} con ${bestDayQuantity} ventas. `;

      if (growth > 0) {
        insightMessage += `📈 Las ventas crecieron un ${growth}% en la segunda mitad del período.`;
      } else if (growth < 0) {
        insightMessage += `📉 Las ventas disminuyeron un ${Math.abs(growth)}% en la segunda mitad.`;
      } else {
        insightMessage += "📊 Las ventas se mantuvieron estables.";
      }

      setInsight(insightMessage);
    }
  };

  const getRandomColor = (seed) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD93D",
      "#6BCB77",
      "#4D96FF",
      "#FF8AAE",
      "#B983FF",
      "#94B3FD",
    ];
    return colors[seed % colors.length];
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "general") {
      setSelectedCategory(null);
      setSelectedItem(null);
    } else if (tab === "categories") {
      setSelectedItem(null);
    }
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategory(null);
      if (activeTab === "items") {
        setSelectedItem(null);
      }
    } else {
      setSelectedCategory(categoryId);
      if (activeTab === "items") {
        setSelectedItem(null);
      }
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItem(itemId);
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: chartColors.primary,
    },
  };

  // Calcular KPIs
  const totalItems = filteredSales.reduce(
    (sum, sale) => sum + sale.quantity,
    0,
  );
  const totalRevenue = filteredSales.reduce((sum, sale) => {
    const item = menuItems.find((m) => m.id === sale.menuItemId);
    return sum + sale.quantity * (item?.price || 0);
  }, 0);
  const daysDiff =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;
  const averagePerDay =
    daysDiff > 0 ? Math.round((totalItems / daysDiff) * 10) / 10 : 0;

  const getChartTitle = () => {
    if (activeTab === "general") return "📊 Ventas Totales";
    if (activeTab === "categories") {
      if (selectedCategory) {
        const category = categories.find((c) => c.id === selectedCategory);
        return category
          ? `🏷️ Ventas en ${category.name}`
          : "🏷️ Ventas por Categoría";
      }
      return "🏷️ Ventas por Categoría";
    }
    if (activeTab === "items") {
      if (selectedItem) {
        const item = menuItems.find((i) => i.id === selectedItem);
        return item ? `🍽️ Ventas de ${item.name}` : "🍽️ Selecciona un item";
      }
      return "🍽️ Ventas por Item";
    }
    return "📊 Ventas";
  };

  const showCategoryFilter =
    activeTab === "categories" || activeTab === "items";
  const showItemFilter = activeTab === "items";

  const renderCategorySelector = () => {
    if (!showCategoryFilter) return null;

    const selectedCategoryObj = selectedCategory
      ? categories.find((c) => c.id === selectedCategory)
      : null;

    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>
          {activeTab === "items"
            ? "Selecciona una categoría:"
            : "Filtrar por categoría:"}
        </Text>
        <CategoryFilterWithData
          selectedCategory={selectedCategory || "all"}
          onSelectCategory={handleCategorySelect}
          variant="full"
          showAllOption={true}
        />

        {activeTab === "items" && selectedCategoryObj && (
          <Text style={styles.selectedCategoryHint}>
            Mostrando items de: {selectedCategoryObj.name}
          </Text>
        )}
      </View>
    );
  };

  const renderItemSelector = () => {
    if (!showItemFilter || !selectedCategory) return null;

    const selectedCategoryObj = categories.find(
      (c) => c.id === selectedCategory,
    );
    const itemsInCategory = menuItems.filter(
      (item) => item.categoryId === selectedCategory && item.isActive,
    );

    if (itemsInCategory.length === 0) {
      return (
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>No hay items en esta categoría</Text>
        </View>
      );
    }

    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>
          Seleccionar item en {selectedCategoryObj?.name}:
        </Text>
        <ItemSelector
          items={itemsInCategory}
          selectedItemId={selectedItem}
          onSelectItem={handleItemSelect}
          categoryName={selectedCategoryObj?.name}
          placeholder="Elige un item del menú..."
        />

        {selectedItem && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSelectedItem(null)}
          >
            <Text style={styles.clearButtonText}>✕ Limpiar selección</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con selector de fechas */}
      <View style={[styles.header, { backgroundColor: chartColors.primary }]}>
        <Text style={styles.title}>Estadísticas de Ventas</Text>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
        />
      </View>

      {/* KPIs principales */}
      <KPICards
        totalItems={totalItems}
        totalRevenue={totalRevenue}
        averagePerDay={averagePerDay}
        colors={chartColors}
      />

      {/* Pestañas de filtro */}
      <FilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={[
          { id: "general", label: "📊 General", icon: "📊" },
          { id: "categories", label: "🏷️ Categorías", icon: "🏷️" },
          { id: "items", label: "🍽️ Items", icon: "🍽️" },
        ]}
      />

      {/* Filtros adicionales según pestaña */}
      {renderCategorySelector()}
      {renderItemSelector()}

      {/* Selector de tipo de gráfico */}
      <ChartTypeSelector selectedType={chartType} onSelect={setChartType} />

      {/* Gráfico principal */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{getChartTitle()}</Text>

        {!chartData ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataEmoji}>📉</Text>
            <Text style={styles.noDataText}>No hay datos para mostrar</Text>
            <Text style={styles.noDataSubtext}>
              Prueba con otro rango de fechas
            </Text>
          </View>
        ) : (
          <>
            {chartType === "line" && chartData.labels && (
              <LineChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            )}

            {chartType === "bar" && chartData.labels && (
              <BarChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
              />
            )}

            {chartType === "pie" &&
              Array.isArray(chartData) &&
              chartData.length > 0 && (
                <PieChart
                  data={chartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="quantity"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              )}
          </>
        )}
      </View>

      {/* Desglose por categoría (solo si no estamos en pestaña de categorías) */}
      {activeTab !== "categories" && categoryData.length > 0 && (
        <CategoryBreakdown data={categoryData} colors={chartColors} />
      )}

      {/* Top items */}
      {topItems.length > 0 && (
        <TopItemsList
          items={topItems}
          title={
            activeTab === "items"
              ? "📊 Rendimiento del item"
              : "🏆 Top 10 Items más vendidos"
          }
          showRevenue={true}
          colors={chartColors}
        />
      )}

      {/* Insight card */}
      <InsightCard insight={insight} colors={chartColors} />
    </ScrollView>
  );
};

const enhance = withObservables([], () => ({
  menuItems: database.collections.get("menu_items").query().observe(),
  allSales: database.collections.get("sales").query().observe(),
  categories: database.collections.get("categories").query().observe(),
}));

export default enhance(ChartsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  filterSection: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },
  selectedCategoryHint: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 8,
    fontStyle: "italic",
  },
  clearButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    padding: 8,
  },
  clearButtonText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2C3E50",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#95A5A6",
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#95A5A6",
    marginTop: 5,
  },
});
