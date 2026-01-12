import { createContext, useContext, useState } from 'react';
import CustomModal from '../components/CustomModal';
import ConfirmModal from '../components/ConfirmModal';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    autoClose: true,
    autoCloseDelay: 3000
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
    onConfirm: () => {}
  });

  const showModal = ({ type = 'success', title, message, autoClose = true, autoCloseDelay = 3000 }) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      autoClose,
      autoCloseDelay
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirm = ({ 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?', 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    onConfirm = () => {}
  }) => {
    return new Promise((resolve) => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          onConfirm();
          resolve(true);
        }
      });
    });
  };

  const hideConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Convenience methods
  const showSuccess = (title, message, options = {}) => {
    showModal({ type: 'success', title, message, ...options });
  };

  const showError = (title, message, options = {}) => {
    showModal({ type: 'error', title, message, ...options });
  };

  const showWarning = (title, message, options = {}) => {
    showModal({ type: 'warning', title, message, ...options });
  };

  const showInfo = (title, message, options = {}) => {
    showModal({ type: 'info', title, message, ...options });
  };

  const value = {
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <CustomModal
        isOpen={modal.isOpen}
        onClose={hideModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        autoClose={modal.autoClose}
        autoCloseDelay={modal.autoCloseDelay}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={hideConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />
    </ModalContext.Provider>
  );
};