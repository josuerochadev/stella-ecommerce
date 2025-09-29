import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'default',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center font-action tracking-wider
    transition-all duration-200 ease-out rounded-md
    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `.trim();

  const variantClasses = {
    default: `
      bg-special text-primary
      hover:bg-primary hover:text-text hover:transform hover:scale-105 hover:shadow-lg
      active:scale-95
    `,
    outline: `
      border-2 border-primary text-text bg-transparent
      hover:bg-primary hover:text-white
      active:bg-primary/90
    `,
    ghost: `
      text-text bg-transparent
      hover:bg-primary/10
      active:bg-primary/20
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700 hover:shadow-lg
      active:bg-red-800
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
      )}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;