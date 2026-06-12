import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] w-full max-w-md rounded-xl p-8 relative border border-white/10 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-subdued hover:text-text-bright transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-8 text-center">
          {isLogin ? 'Log in to Spotify' : 'Sign up for Spotify'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold">Email address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#242424] border border-white/10 p-3 rounded-md focus:border-primary outline-none transition-colors"
              placeholder="Email address"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#242424] border border-white/10 p-3 rounded-md focus:border-primary outline-none transition-colors"
              placeholder="Password"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold p-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-text-subdued">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-text-bright font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
