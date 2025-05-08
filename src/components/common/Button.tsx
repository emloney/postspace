import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary';
  
  const variantStyles = {
    primary: 'bg-accent-primary hover:bg-accent-hover text-white focus:ring-accent-primary',
    secondary: 'bg-accent-secondary hover:bg-accent-secondary/90 text-white focus:ring-accent-secondary',
    outline: 'border border-border hover:border-text-tertiary bg-transparent text-text-primary focus:ring-border',
    ghost: 'hover:bg-background-tertiary bg-transparent text-text-primary focus:ring-transparent',
    danger: 'bg-error hover:bg-error/90 text-white focus:ring-error',
  };
  
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-base px-6 py-3 h-12',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const disabledStyles = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <motion.button
    {...({
      whileTap:   { scale: 0.97 },
      whileHover: { scale: 1.02 },
      className: `
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${disabledStyles}
        ${className}
      `,
      disabled: disabled || isLoading,
      ...props,
    } as any)}
  >
    {isLoading
      ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
  </motion.button>
  
  );
};

export default Button;