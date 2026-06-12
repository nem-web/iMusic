import React from 'react';
import { Home, Search, Library } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background-elevated/90 backdrop-blur-lg border-t border-white/5 flex items-center justify-around px-4 z-50">
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-text-bright' : 'text-text-subdued'}`}
      >
        <Home size={24} />
        <span className="text-[10px]">Home</span>
      </Link>
      <Link 
        to="/search" 
        className={`flex flex-col items-center gap-1 ${location.pathname === '/search' ? 'text-text-bright' : 'text-text-subdued'}`}
      >
        <Search size={24} />
        <span className="text-[10px]">Search</span>
      </Link>
      <div className="flex flex-col items-center gap-1 text-text-subdued">
        <Library size={24} />
        <span className="text-[10px]">Library</span>
      </div>
    </div>
  );
};

export default BottomNav;
