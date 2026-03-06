import {
  MD3DarkTheme as DefaultTheme,
  configureFonts,
} from "react-native-paper";

const fontConfig = {
  fontFamily: "System",
};

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#10B981",
    background: "#0F172A",
    surface: "#1E293B",
    surfaceVariant: "#334155",
    text: "#F8FAFC",
    textSecondary: "#CBD5E1",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    border: "#334155",
    elevation: {
      level0: "transparent",
      level1: "#1E293B",
      level2: "#233142",
      level3: "#2A3A4F",
      level4: "#30445C",
      level5: "#374E69",
    },
  },
  roundness: 12,
  fonts: configureFonts({ config: fontConfig }),
};

export const categoryColors = [
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
];
