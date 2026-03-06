// src/components/DatePicker.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

const DatePicker = ({
  value,
  onChange,
  mode = "date",
  maximumDate,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const [Picker, setPicker] = useState(null);

  // Para web, usamos input nativo
  if (Platform.OS === "web") {
    const handleChange = (e) => {
      const date = new Date(e.target.value);
      onChange({ type: "set", nativeEvent: {} }, date);
    };

    // Formatear fecha para input type="date" (YYYY-MM-DD)
    const formatDateForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Obtener fecha máxima para input
    const getMaxDate = () => {
      if (!maximumDate) return undefined;
      return formatDateForInput(maximumDate);
    };

    return (
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={handleChange}
        max={getMaxDate()}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ddd",
          fontSize: 14,
          width: "95%", // Cambiado de 100% a 95%
          backgroundColor: "white",
          ...props.style,
        }}
        {...props}
      />
    );
  }

  // Para móvil, cargamos el DateTimePicker dinámicamente
  useEffect(() => {
    if (!show) return;

    import("@react-native-community/datetimepicker").then((module) => {
      setPicker(() => module.default);
    });
  }, [show]);

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[styles.dateButton, props.buttonStyle]}
      >
        <Text style={styles.dateButtonText}>{formatDate(value)}</Text>
      </TouchableOpacity>

      {show && Picker && (
        <Picker
          value={value}
          mode={mode}
          display="default"
          maximumDate={maximumDate}
          onChange={(event, date) => {
            setShow(false);
            if (date) onChange(event, date);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "95%", // Cambiado de 100% a 95%
  },
  dateButtonText: {
    fontSize: 14,
    color: "#2C3E50",
    textAlign: "center",
  },
});

export default DatePicker;
