
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-vanguard-bg-secondary border-b border-vanguard-bg-tertiary shadow-md">
      <div>
        <h2 className="text-2xl font-semibold text-vanguard-text">Project: The Chronos Key</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-vanguard-accent rounded-full flex items-center justify-center font-bold text-white">
          JV
        </div>
      </div>
    </header>
  );
};

export default Header;
