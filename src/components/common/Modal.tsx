import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import XIcon from '../icons/XIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Focus trap
    const handleFocus = (event: FocusEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        event.preventDefault();
        modalRef.current.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('focus', handleFocus, true);
    }

    return () => {
      document.removeEventListener('focus', handleFocus, true);
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        size={size}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <XIcon size={24} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

const getModalWidth = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  switch (size) {
    case 'sm':
      return '400px';
    case 'md':
      return '600px';
    case 'lg':
      return '800px';
    case 'xl':
      return '1000px';
    default:
      return '600px';
  }
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.modalOverlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled.div<{ size: 'sm' | 'md' | 'lg' | 'xl' }>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: ${({ size }) => getModalWidth(size)};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  outline: none;
  position: relative;
  animation: modalFadeIn 0.3s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export default Modal; 