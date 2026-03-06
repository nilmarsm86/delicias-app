import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Cancelar',
  });

  const showAlert = useCallback(({ title, message, onConfirm, onCancel, confirmText, cancelText }) => {
    setAlertState({
      visible: true,
      title,
      message,
      onConfirm: onConfirm || (() => hideAlert()),
      onCancel: onCancel || (() => hideAlert()),
      confirmText: confirmText || 'OK',
      cancelText: cancelText || 'Cancelar',
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    alertState,
    showAlert,
    hideAlert,
  };
};