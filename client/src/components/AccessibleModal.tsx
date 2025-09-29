// client/src/components/AccessibleModal.tsx
// Responsabilité unique : Orchestrateur principal de modal accessible

import { createPortal } from 'react-dom';
import { useFocusTrap } from '../hooks/useFocusManagement';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { ModalStylesService, ModalType, ModalSize } from '../utils/modalStyles';
import ModalContent from './ModalContent';
import ModalActions from './ModalActions';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children?: React.ReactNode;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

/**
 * Composant de modal accessible avec focus trap et navigation clavier
 * Responsabilité unique : Orchestration de l'affichage modal accessible
 */
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

  const { isVisible, handleOverlayClick, handleConfirm } = useModalBehavior({
    isOpen,
    onClose,
    closeOnEscape,
    modalRef,
  });

  // Ne pas rendre si la modal n'est pas visible
  if (!isVisible) {
    return null;
  }

  const modalClasses = `${ModalStylesService.getBaseModalClasses(size)} ${className}`;
  const showActions = onConfirm !== undefined;

  // Contenu de la modal
  return createPortal(
    <div
      className={ModalStylesService.getOverlayClasses()}
      onClick={(e) => handleOverlayClick(e, closeOnOverlayClick)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef as any}
        className={modalClasses}
        role="document"
      >
        {/* Contenu principal */}
        <ModalContent
          type={type}
          title={title}
          message={message}
          showCloseButton={showCloseButton}
          onClose={onClose}
        >
          {children}
        </ModalContent>

        {/* Actions */}
        <ModalActions
          type={type}
          onConfirm={onConfirm ? () => handleConfirm(onConfirm) : undefined}
          onCancel={onClose}
          confirmText={confirmText}
          cancelText={cancelText}
          showActions={showActions}
        />
      </div>
    </div>,
    document.body
  );
};

export default AccessibleModal;