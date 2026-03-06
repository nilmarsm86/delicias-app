import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toastState, setToastState] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToastState({
      visible: true,
      message,
      type,
      duration,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    toastState,
    showToast,
    hideToast,
  };
};