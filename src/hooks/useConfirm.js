import { useState, useCallback } from 'react';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const showConfirm = useCallback(({ title, message, onConfirm, onCancel }) => {
    return new Promise((resolve) => {
      setConfirmState({
        visible: true,
        title,
        message,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, visible: false }));
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, visible: false }));
          if (onCancel) onCancel();
          resolve(false);
        },
      });
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    confirmState,
    showConfirm,
    hideConfirm,
  };
};