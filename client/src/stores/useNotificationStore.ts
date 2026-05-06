import { create } from 'zustand';
import type { ToastType } from "@/components/Toast";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  id: string;
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface NotificationState {
  toasts: Toast[];
  modals: Modal[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showModal: (modal: Omit<Modal, 'id' | 'isOpen'>) => Promise<boolean>;
  closeModal: (id: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showConfirm: (title: string, message: string, type?: 'danger' | 'warning' | 'info') => Promise<boolean>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  toasts: [],
  modals: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast = { ...toast, id };
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  showModal: (modal) => {
    return new Promise<boolean>((resolve) => {
      const id = Math.random().toString(36).substring(2, 11);
      const newModal: Modal = {
        ...modal,
        id,
        isOpen: true,
        onConfirm: () => {
          get().closeModal(id);
          resolve(true);
        },
        onCancel: () => {
          get().closeModal(id);
          resolve(false);
        },
      };
      set((state) => ({
        modals: [...state.modals, newModal],
      }));
    });
  },

  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },

  showSuccess: (title, message) => {
    get().addToast({
      type: 'success',
      title,
      message,
      duration: 5000,
    });
  },

  showError: (title, message) => {
    get().addToast({
      type: 'error',
      title,
      message,
      duration: 7000,
    });
  },

  showWarning: (title, message) => {
    get().addToast({
      type: 'warning',
      title,
      message,
      duration: 6000,
    });
  },

  showInfo: (title, message) => {
    get().addToast({
      type: 'info',
      title,
      message,
      duration: 5000,
    });
  },

  showConfirm: (title, message, type = 'info') => {
    return get().showModal({
      title,
      message,
      type,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
    });
  },
}));