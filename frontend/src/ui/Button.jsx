import React from 'react';
import './Button.css'; // Puedes crear un CSS específico o usar Tailwind/Modules

export const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};