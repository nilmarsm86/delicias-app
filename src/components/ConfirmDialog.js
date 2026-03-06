import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';

const colors = {
  primary: '#FF6B6B',     // Rojo coral
  secondary: '#4ECDC4',    // Turquesa
  accent: '#FFE66D',       // Amarillo
  background: '#F7F7F7',   // Gris claro
  surface: '#FFFFFF',      // Blanco
  text: '#2C3E50',         // Azul oscuro
  textLight: '#95A5A6',    // Gris
  success: '#2ECC71',      // Verde
  warning: '#F39C12',      // Naranja
  error: '#E74C3C',        // Rojo
};

const ConfirmDialog = ({ visible, title, message, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>No</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>Sí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  },
  dialogContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: Platform.OS === 'web' ? 350 : '80%',
    maxWidth: 350,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmButton: {
  backgroundColor: colors?.primary || '#FF6B6B',
},
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
});

export default ConfirmDialog;