import React from 'react';
import { Home, Search, Library, Play, Pause, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

const Sidebar: React.FC = () => {
  const { queue, currentTrack, isPlaying, setTrack, togglePlay } = usePlayerStore();

  const handlePlay = (song: any) => {
    if (currentTrack?.id === song.id) {
      togglePlay();
    } else {
      setTrack(song);
    }
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-black h-full p-2 gap-2">
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
            <span>Current Queue</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 overflow-y-auto pr-2 no-scrollbar">
          {queue.length === 0 ? (
            <div className="text-center text-text-subdued text-sm mt-10">
              <Music2 size={32} className="mx-auto mb-4 opacity-50" />
              <p>Your queue is empty.</p>
              <p className="text-xs mt-2">Play an album or search for songs to fill it up.</p>
            </div>
          ) : (
            queue.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              return (
                <div 
                  key={`${song.id}-${index}`} 
                  onClick={() => handlePlay(song)}
                  className={`flex items-center gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer group transition-colors ${isCurrent ? 'bg-white/5' : ''}`}
                >
                  <div className="relative w-12 h-12 bg-background-elevated rounded flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      {isCurrent && isPlaying ? <Pause size={20} fill="white" color="white" /> : <Play size={20} fill="white" color="white" className="ml-1" />}
                    </div>
                  </div>
                  <div className="flex flex-col overflow-hidden min-w-0">
                    <span className={`text-sm font-medium truncate ${isCurrent ? 'text-primary' : 'text-text-bright'}`}>{song.title}</span>
                    <span className="text-xs text-text-subdued truncate">{song.artist}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
