import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const PwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Check if we've already shown the prompt this session/recently
      const hasDismissed = localStorage.getItem('pwaPromptDismissed');
      if (!hasDismissed) {
        // Delay showing prompt slightly for better UX
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember that user dismissed it so we don't spam them
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return createPortal(
    <div className="fixed bottom-4 md:bottom-28 right-4 z-[9999] bg-[#242424] border border-white/10 shadow-2xl rounded-xl p-4 flex items-start gap-4 max-w-sm animate-in slide-in-from-bottom-5">
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg">
        <Download size={24} className="text-black" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-text-bright mb-1">Install App</h3>
        <p className="text-xs text-text-subdued mb-3">Install Spotify Clone for a faster, app-like experience.</p>
        <div className="flex gap-2">
          <button 
            onClick={handleInstall}
            className="bg-primary text-black text-xs font-bold px-4 py-1.5 rounded-full hover:scale-105 transition-transform"
          >
            Install
          </button>
          <button 
            onClick={handleDismiss}
            className="text-text-subdued text-xs font-bold px-4 py-1.5 hover:text-text-bright transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
      <button 
        onClick={handleDismiss}
        className="text-text-subdued hover:text-text-bright transition-colors -mt-1 -mr-1"
      >
        <X size={18} />
      </button>
    </div>,
    document.body
  );
};

export default PwaPrompt;
