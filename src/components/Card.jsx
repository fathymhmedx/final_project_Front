import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl
        shadow-xl shadow-black/20
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
