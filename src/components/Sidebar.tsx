import React from 'react';
import { Home, Search, Library, Plus, Heart, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-black h-full p-2 gap-2">
      <div className="bg-background-highlight rounded-lg p-4 flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-4 text-text-subdued hover:text-text-bright transition-colors font-bold">
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link to="/search" className="flex items-center gap-4 text-text-subdued hover:text-text-bright transition-colors font-bold">
          <Search size={24} />
          <span>Search</span>
        </Link>
      </div>

      <div className="bg-background-highlight rounded-lg p-4 flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between text-text-subdued">
          <div className="flex items-center gap-2 hover:text-text-bright transition-colors cursor-pointer font-bold">
            <Library size={24} />
            <span>Your Library</span>
          </div>
          <Plus size={20} className="hover:text-text-bright cursor-pointer" />
        </div>

        <div className="flex flex-col gap-2 mt-4 overflow-y-auto pr-2">
          {/* Mock Playlists */}
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center">
              <Heart size={20} fill="white" color="white" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">Liked Songs</span>
              <span className="text-xs text-text-subdued">Playlist • 120 songs</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group">
            <div className="w-12 h-12 bg-background-elevated rounded flex items-center justify-center">
              <Music2 size={24} className="text-text-subdued" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">Daily Mix 1</span>
              <span className="text-xs text-text-subdued">Playlist • Spotify</span>
            </div>
          </div>
          
          {/* Scrollable area filler */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group">
              <div className="w-12 h-12 bg-background-elevated rounded flex items-center justify-center">
                <Music2 size={24} className="text-text-subdued" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">My Playlist #{i + 2}</span>
                <span className="text-xs text-text-subdued">Playlist • User</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
