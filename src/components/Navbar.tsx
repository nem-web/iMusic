import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="h-16 flex items-center justify-between px-6 sticky top-0 bg-background-base/60 backdrop-blur-md z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-text-subdued hover:text-text-bright transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-text-subdued hover:text-text-bright transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="text-text-subdued hover:text-text-bright font-bold px-4 py-2 transition-colors"
            >
              Sign up
            </button>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-white text-black px-8 py-2.5 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Log in
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform hidden md:block">
              Explore Premium
            </button>
            <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-text-subdued hover:text-text-bright transition-colors">
              <Bell size={20} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-text-subdued hover:text-text-bright transition-colors ring-2 ring-transparent hover:ring-white/20"
              >
                <User size={20} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background-elevated rounded-md shadow-2xl border border-white/5 p-1 z-50">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-sm transition-colors">
                    Account
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-sm transition-colors">
                    Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-sm transition-colors">
                    Settings
                  </button>
                  <div className="h-[1px] bg-white/5 my-1" />
                  <button 
                    onClick={() => {
                      signOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-sm transition-colors flex items-center justify-between"
                  >
                    Log out
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Navbar;
