import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from './Player';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import PwaPrompt from './PwaPrompt';
import { supabase } from '../services/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';

const Layout: React.FC = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black pb-[140px] md:pb-24">
      <PwaPrompt />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-background-base relative overflow-hidden md:m-2 md:ml-0 md:rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-background-base pointer-events-none" />
          <Navbar />
          <div className="flex-1 overflow-y-auto relative scroll-smooth pb-8">
            <Outlet />
            <footer className="p-8 mt-12 border-t border-white/5 text-text-subdued text-sm hidden md:block">
              <div className="flex flex-wrap gap-8 justify-between">
                <div className="flex flex-wrap gap-6">
                  <span className="hover:text-text-bright cursor-pointer">Legal</span>
                  <span className="hover:text-text-bright cursor-pointer">Privacy Center</span>
                  <span className="hover:text-text-bright cursor-pointer">Privacy Policy</span>
                  <span className="hover:text-text-bright cursor-pointer">Cookies</span>
                  <span className="hover:text-text-bright cursor-pointer">About Ads</span>
                  <span className="hover:text-text-bright cursor-pointer">Accessibility</span>
                </div>
                <span>© 2026 Spotify Clone</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
      <Player />
      <BottomNav />
    </div>
  );
};

export default Layout;

