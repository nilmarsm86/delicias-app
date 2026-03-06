// App.js
import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, View, Text } from "react-native";
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { database, write, getCollection } from "./src/database";
import HomeScreen from "./src/screens/HomeScreen";
import ChartsScreen from "./src/screens/ChartsScreen";
import AdminScreen from "./src/screens/AdminScreen";

const Tab = createBottomTabNavigator();

const colors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  text: "#2C3E50",
};

const initialCategories = [
  { name: "Comidas", color: "#FF6B6B" },
  { name: "Bebidas", color: "#4ECDC4" },
  { name: "Postres", color: "#FFD93D" },
  { name: "Otros", color: "#6BCB77" },
];

const initialMenuItems = [
  { name: "Hamburguesa Clásica", price: 12.99 },
  { name: "Pizza Margherita", price: 15.99 },
  { name: "Ensalada César", price: 8.99 },
  { name: "Coca Cola", price: 2.5 },
  { name: "Agua Mineral", price: 1.5 },
  { name: "Cerveza Artesanal", price: 4.99 },
  { name: "Tarta de Manzana", price: 5.99 },
  { name: "Brownie con Helado", price: 6.99 },
];

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        console.log("Inicializando base de datos...");

        // Verificar que la colección 'categories' existe
        let categoryCollection;
        try {
          categoryCollection = getCollection("categories");
          console.log("✅ Colección categories encontrada");
        } catch (e) {
          console.log("❌ Colección categories NO encontrada:", e.message);
          throw new Error(
            "La tabla categories no existe. Por favor, reinicia la app para ejecutar migraciones.",
          );
        }

        const categoryCount = await categoryCollection.query().fetchCount();
        console.log(`Categorías existentes: ${categoryCount}`);

        let categories = [];

        if (categoryCount === 0) {
          console.log("Creando categorías iniciales...");
          await write(async () => {
            for (const cat of initialCategories) {
              const newCategory = await categoryCollection.create(
                (category) => {
                  category.name = cat.name;
                  category.color = cat.color;
                  category.isActive = true;
                },
              );
              categories.push(newCategory);
              console.log(`✅ Categoría creada: ${cat.name}`);
            }
          });
        } else {
          categories = await categoryCollection.query().fetch();
          console.log(`📋 Categorías cargadas: ${categories.length}`);
        }

        // Verificar items del menú
        const menuCollection = getCollection("menu_items");
        const menuCount = await menuCollection.query().fetchCount();
        console.log(`Items existentes: ${menuCount}`);

        if (menuCount === 0 && categories.length > 0) {
          console.log("Creando items iniciales...");
          await write(async () => {
            for (let i = 0; i < initialMenuItems.length; i++) {
              const item = initialMenuItems[i];
              const categoryIndex = i % categories.length;

              await menuCollection.create((menuItem) => {
                menuItem.name = item.name;
                menuItem.price = item.price;
                menuItem.categoryId = categories[categoryIndex].id;
                menuItem.isActive = true;
              });
              console.log(`✅ Item creado: ${item.name}`);
            }
          });
        }

        console.log("✅ Base de datos inicializada correctamente");
        setIsDbReady(true);
      } catch (error) {
        console.error("❌ Error inicializando DB:", error);
        setError(error.message);
      }
    };

    initDatabase();
  }, []);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "red", fontSize: 18, marginBottom: 10 }}>
          Error
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>{error}</Text>
        <Text style={{ textAlign: "center", color: "#666" }}>
          Por favor, cierra y vuelve a abrir la app para ejecutar las
          migraciones.
        </Text>
      </View>
    );
  }

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Inicializando base de datos...
        </Text>
        <Text style={{ color: "#666" }}>Espera un momento</Text>
      </View>
    );
  }

  return (
    <DatabaseProvider database={database}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: "#999",
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Ventas"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20, color }}>📝</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Estadísticas"
            component={ChartsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20, color }}>📊</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Admin"
            component={AdminScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20, color }}>⚙️</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  );
}
