import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      isFullWidth={isFullWidth}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <Spinner />}
      {!isLoading && leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
      {children}
      {!isLoading && rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.primary}dd`};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.secondary}dd`};
        }
      `;
    case 'danger':
      return css`
        background-color: ${({ theme }) => theme.colors.danger};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.danger}dd`};
        }
      `;
    case 'success':
      return css`
        background-color: ${({ theme }) => theme.colors.success};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.success}dd`};
        }
      `;
    case 'warning':
      return css`
        background-color: ${({ theme }) => theme.colors.warning};
        color: ${({ theme }) => theme.colors.dark};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.warning}dd`};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary};
        border: 1px solid ${({ theme }) => theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.hover};
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.hover};
        }
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => `${theme.colors.primary}dd`};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
        font-size: ${({ theme }) => theme.font.size.sm};
      `;
    case 'md':
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
        font-size: ${({ theme }) => theme.font.size.md};
      `;
    case 'lg':
      return css`
        padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
        font-size: ${({ theme }) => theme.font.size.lg};
      `;
    default:
      return css`
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
        font-size: ${({ theme }) => theme.font.size.md};
      `;
  }
};

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  isFullWidth: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'auto')};
  
  ${({ variant }) => getVariantStyles(variant)};
  ${({ size }) => getSizeStyles(size)};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.sm};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Button; 