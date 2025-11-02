
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-vanguard-bg-secondary rounded-lg border border-vanguard-bg-tertiary shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-vanguard-bg-tertiary">
        <h3 className="text-lg font-semibold text-vanguard-text">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
