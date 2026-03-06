// src/components/CategoryFilter.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "../database";

// Colores para el componente
const colors = {
  primary: "#FF6B6B",
  text: "#2C3E50",
  textLight: "#95A5A6",
};

const CategoryFilter = ({
  categories = [], // Ahora recibimos las categorías de la base de datos
  selectedCategory,
  onSelectCategory,
  variant = "compact",
  showAllOption = true,
  loading = false,
}) => {
  // Construir lista de categorías con opción "Todos" si es necesario
  const allCategories = showAllOption
    ? [{ id: "all", name: "Todos", color: colors.primary }, ...categories]
    : categories;

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  // Si no hay categorías, mostrar mensaje
  if (categories.length === 0 && !showAllOption) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No hay categorías disponibles</Text>
      </View>
    );
  }

  // Estilos según la variante
  const getContainerStyle = () => {
    return variant === "compact"
      ? styles.compactContainer
      : styles.fullContainer;
  };

  const getChipStyle = (category) => {
    const baseStyle =
      variant === "compact" ? styles.compactChip : styles.fullChip;
    const isSelected =
      showAllOption && category.id === "all"
        ? selectedCategory === "all"
        : selectedCategory === category.id;

    // Para la opción "Todos", usar color primario
    if (showAllOption && category.id === "all") {
      return [
        baseStyle,
        isSelected
          ? { backgroundColor: colors.primary }
          : { backgroundColor: "#f0f0f0" },
      ];
    }

    // Para categorías normales, usar su color
    return [
      baseStyle,
      isSelected
        ? { backgroundColor: category.color || colors.primary }
        : { backgroundColor: "#f0f0f0" },
    ];
  };

  const getTextStyle = (category) => {
    const baseStyle =
      variant === "compact" ? styles.compactChipText : styles.fullChipText;
    const isSelected =
      showAllOption && category.id === "all"
        ? selectedCategory === "all"
        : selectedCategory === category.id;

    return [
      baseStyle,
      isSelected ? { color: "white" } : { color: colors.text },
    ];
  };

  const handleSelect = (category) => {
    if (showAllOption && category.id === "all") {
      onSelectCategory("all");
    } else {
      onSelectCategory(category.id);
    }
  };

  return (
    <View style={[styles.container, getContainerStyle()]}>
      {variant === "full" && (
        <Text style={styles.filterTitle}>Categorías:</Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={getChipStyle(category)}
            onPress={() => handleSelect(category)}
          >
            <Text style={getTextStyle(category)}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Versión con observable para conectar directamente a la base de datos
export const CategoryFilterWithData = withObservables([], () => ({
  categories: database.collections.get("categories").query().observe(),
}))(CategoryFilter);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.textLight,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: "italic",
  },
  // Variante compacta
  compactContainer: {
    marginTop: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  compactChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  compactChipText: {
    fontSize: 13,
  },

  // Variante completa
  fullContainer: {
    margin: 15,
    marginBottom: 0,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fullChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  fullChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
});

// Exportar también la versión simple para cuando se pasen categorías manualmente
export default CategoryFilter;
