import { Database } from "@nozbe/watermelondb";
import schema from "./schema";
import migrations from "./migrations";
import MenuItem from "../models/MenuItem";
import Sale from "../models/Sale";
import Category from "../models/Category";
import Expense from "..//models/Expense";
import { Platform } from "react-native";

let adapter;
let database;

if (Platform.OS === "web") {
  // Para web: usar adaptador LokiJS o SQLite.js
  const LokiJSAdapter = require("@nozbe/watermelondb/adapters/lokijs").default;

  adapter = new LokiJSAdapter({
    schema,
    migrations,
    dbName: "lasdelicias",
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  });

  database = new Database({
    adapter,
    modelClasses: [MenuItem, Sale, Category, Expense],
  });
} else {
  // Para móvil: usar SQLite
  const SQLiteAdapter = require("@nozbe/watermelondb/adapters/sqlite").default;

  adapter = new SQLiteAdapter({
    schema,
    migrations,
    dbName: "lasdelicias.db",
    jsi: true,
  });

  database = new Database({
    adapter,
    modelClasses: [MenuItem, Sale, Category, Expense],
  });
}

export { database };
export const write = async (callback) => await database.write(callback);
export const getCollection = (name) => database.collections.get(name);
