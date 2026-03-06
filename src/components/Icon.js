// src/components/Icon.js
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const IconComponent = ({
  name,
  size = 24,
  color = "#000",
  ...props
}) => {
  // Mapeo de nombres de iconos de Lucide a MaterialCommunityIcons
  const iconMap = {
    // Navegación
    home: "home",
    sales: "cart",
    stats: "chart-bar",
    admin: "cog",
    menu: "menu",

    // Acciones
    add: "plus",
    edit: "pencil",
    delete: "delete",
    save: "content-save",
    reset: "refresh",
    close: "close",
    back: "arrow-left",
    next: "arrow-right",
    plus: "plus",
    minus: "minus",

    // Categorías
    food: "food",
    drinks: "cup",
    dessert: "cake",
    other: "package-variant",

    // Ventas
    cart: "cart",
    cash: "cash",
    trend: "trending-up",
    calendar: "calendar",

    // Estadísticas
    chart: "chart-box",
    pieChart: "chart-pie",
    lineChart: "chart-line",
    barChart: "chart-bar",

    // Gastos
    expense: "credit-card",
    money: "currency-usd",
    receipt: "receipt",

    // UI
    search: "magnify",
    filter: "filter",
    sort: "sort",
    check: "check",
    alert: "alert-circle",
    info: "information",
    warning: "alert",
    success: "check-circle",

    // Items
    dish: "silverware-fork-knife",
    beverage: "glass-cocktail",
    package: "package",

    // Usuarios
    user: "account",
    users: "account-group",
    profile: "account-circle",

    // Empresa
    restaurant: "store",
    logo: "silverware",

    // Flechas para cantidad
    "chevron-up": "chevron-up",
    "chevron-down": "chevron-down",
  };

  const iconName = iconMap[name] || "help-circle";

  return <Icon name={iconName} size={size} color={color} {...props} />;
};

export default IconComponent;
