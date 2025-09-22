import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../hooks/useFocusManagement';
import { ARIA_LABELS } from '../utils/accessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}) => {
  const modalRef = useFocusTrap(isOpen);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('aria-hidden', 'true');
    } else {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className={`relative w-full ${getSizeClasses()} bg-secondary border border-primary/20 rounded-lg shadow-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2
            id="modal-title"
            className="text-xl font-display text-text"
          >
            {title}
          </h2>

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
        </div>

        {/* Content */}
        <div id="modal-description" className="p-6">
          {children}
        </div>

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

export default AccessibleModal;