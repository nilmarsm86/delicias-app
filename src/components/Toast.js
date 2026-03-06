import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

const Toast = ({ visible, message, type = 'success', duration = 3000, onHide, colors }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const backgroundColor = {
    success: colors?.success || '#2ECC71',
    error: colors?.error || '#E74C3C',
    warning: colors?.warning || '#F39C12',
    info: colors?.secondary || '#4ECDC4',
  }[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, opacity: fadeAnim },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    ...Platform.select({
      web: {
        position: 'fixed',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: 400,
        marginHorizontal: 'auto',
      },
    }),
  },
  message: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Toast;