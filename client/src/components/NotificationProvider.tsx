import { useNotificationStore } from "@/stores/useNotificationStore";
import type React from "react";
import AccessibleModal from "./AccessibleModal";
import Toast from "./Toast";

const NotificationProvider: React.FC = () => {
  const { toasts, modals, removeToast, closeModal } = useNotificationStore();

  return (
    <>
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>

      {modals.map((modal) => (
        <AccessibleModal
          key={modal.id}
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onClose={() => {
            if (modal.onCancel) modal.onCancel();
            closeModal(modal.id);
          }}
          onConfirm={modal.onConfirm}
        />
      ))}
    </>
  );
};

export default NotificationProvider;
