import React from 'react';

const variants = {
  primary:
    'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-cyan-400',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 border border-white/10',
  outline:
    'border border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold text-sm
        px-6 py-3
        transition-all duration-300 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        ${variants[variant] || variants.primary}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
