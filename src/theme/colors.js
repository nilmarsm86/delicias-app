// src/theme/colors.js
export const colors = {
  // Colores primarios - Púrpura como color principal (más moderno que el rojo)
  primary: "#8B5CF6", // Púrpura vibrante
  primaryLight: "#A78BFA",
  primaryDark: "#7C3AED",

  // Colores secundarios
  secondary: "#EC4899", // Rosa neón
  secondaryLight: "#F472B6",
  secondaryDark: "#DB2777",

  // Colores de acento
  accent: "#10B981", // Verde esmeralda
  accentLight: "#34D399",
  accentDark: "#059669",

  // Colores de fondo
  background: "#0F172A", // Azul muy oscuro (modo oscuro moderno)
  surface: "#1E293B", // Superficie ligeramente más clara
  surfaceLight: "#334155",

  // Colores de texto
  text: "#F8FAFC", // Blanco suave
  textSecondary: "#CBD5E1",
  textLight: "#94A3B8",

  // Colores de estado
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Colores de borde
  border: "#334155",
  borderLight: "#475569",

  // Colores de categorías (vibrantes)
  category1: "#8B5CF6", // Púrpura
  category2: "#EC4899", // Rosa
  category3: "#10B981", // Verde
  category4: "#F59E0B", // Ámbar
  category5: "#3B82F6", // Azul
  category6: "#EF4444", // Rojo
};

export const gradients = {
  primary: ["#8B5CF6", "#EC4899"],
  secondary: ["#10B981", "#3B82F6"],
  accent: ["#F59E0B", "#EF4444"],
  dark: ["#0F172A", "#1E293B"],
  glass: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"],
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
};
