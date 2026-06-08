import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '../assets/close-icon.svg?react';

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement;
    modalRef.current?.focus();

    function handleTabTrap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener('keydown', handleTabTrap);

    return () => {
      document.removeEventListener('keydown', handleTabTrap);
      previousActiveElement?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <CloseIcon width="12" height="12" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}

export default Modal;
