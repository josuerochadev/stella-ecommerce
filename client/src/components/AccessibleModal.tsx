import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../hooks/useFocusManagement';
import { ARIA_LABELS } from '../utils/accessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children?: React.ReactNode;
  message?: string; // Pour compatibility avec l'ancien Modal
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'custom',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  showCloseButton = true,
}) => {
  const modalRef = useFocusTrap(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  // Handle modal visibility with transitions
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('aria-hidden', 'true');
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    };
  }, [isOpen]);

  // Handle escape key and custom close events
  useEffect(() => {
    if (!isOpen) return;

    const handleCloseModal = () => {
      if (closeOnEscape) {
        onClose();
      }
    };

    // Listen for escape events from focus trap
    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener('close-modal', handleCloseModal);
      modalElement.addEventListener('escape-pressed', handleCloseModal);

      return () => {
        modalElement.removeEventListener('close-modal', handleCloseModal);
        modalElement.removeEventListener('escape-pressed', handleCloseModal);
      };
    }
  }, [isOpen, closeOnEscape, onClose, modalRef]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-400',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
        };
      case 'info':
        return {
          iconColor: 'text-blue-400',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
        };
      default:
        return {
          iconColor: '',
          confirmButton: 'bg-accent hover:bg-accent/80 text-white',
          icon: null,
        };
    }
  };

  const typeStyles = getTypeStyles();
  const isConfirmationModal = type !== 'custom' && message;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-lg';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={isConfirmationModal ? "modal-message" : "modal-description"}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={modalRef as React.RefObject<HTMLDivElement>}
        className={`relative w-full ${getSizeClasses()} bg-secondary border border-primary/20 rounded-lg shadow-xl transform transition-all duration-150 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isConfirmationModal ? (
          /* Confirmation Modal Layout */
          <>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {typeStyles.icon && (
                  <div className={`flex-shrink-0 ${typeStyles.iconColor}`}>
                    {typeStyles.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 id="modal-title" className="text-lg font-semibold text-text mb-2">
                    {title}
                  </h3>
                  <p id="modal-message" className="text-sm text-text opacity-90 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 px-6 pb-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text bg-primary hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {cancelText}
              </button>
              {onConfirm && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${typeStyles.confirmButton}`}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </>
        ) : (
          /* Custom Modal Layout */
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary/10">
              <h2 id="modal-title" className="text-xl font-display text-text">
                {title}
              </h2>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-text/70 hover:text-text focus:outline-none focus:ring-2 focus:ring-accent rounded"
                  aria-label={ARIA_LABELS.CLOSE_DIALOG}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Content */}
            <div id="modal-description" className="p-6">
              {children}
            </div>
          </>
        )}

        {/* Instructions for screen readers */}
        <div className="sr-only">
          Appuyez sur Échap pour fermer cette boîte de dialogue.
          {closeOnOverlayClick && ' Ou cliquez en dehors de la boîte de dialogue.'}
        </div>
      </div>
    </div>
  );

  // Render modal in portal to ensure proper layering
  return createPortal(modalContent, document.body);
};

// Alias pour la compatibilité avec l'ancien Modal
export const Modal = AccessibleModal;

export default AccessibleModal;