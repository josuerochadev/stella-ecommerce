import React, { forwardRef } from 'react';
import { useTouchInteractions } from '../hooks/useTouchInteractions';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  enableHaptic?: boolean;
  children: React.ReactNode;
}

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(({
  variant = 'primary',
  size = 'md',
  enableHaptic = true,
  className = '',
  children,
  onClick,
  ...props
}, ref) => {
  const { elementRef, isPressed, triggerHaptic } = useTouchInteractions({
    enableHapticFeedback: enableHaptic
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableHaptic) {
      triggerHaptic('medium');
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = 'touch-target button-press focus-ring interactive-element font-semibold rounded-lg transition-all duration-200 ease-out select-none';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-700',
    ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]'
  };

  const pressedClasses = isPressed ? 'scale-95 brightness-90' : '';

  return (
    <button
      ref={(node) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        if (elementRef) {
          elementRef.current = node;
        }
      }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${pressedClasses} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

TouchButton.displayName = 'TouchButton';