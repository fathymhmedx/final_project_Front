import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  rightIcon,
  ...rest
}) => {
  const inputId = name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm text-gray-400 mb-2 font-medium tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full rounded-xl bg-white/5 border text-white placeholder-gray-500
            px-4 py-3 text-sm font-medium outline-none
            transition-all duration-300 ease-in-out
            ${icon ? 'pl-11' : ''}
            ${rightIcon ? 'pr-11' : ''}
            ${
              error
                ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50'
            }
            hover:border-white/20
          `}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors duration-200">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-red-400 text-xs font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
