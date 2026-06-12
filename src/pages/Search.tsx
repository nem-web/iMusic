import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Play } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import type { Playlist } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';

const Search: React.FC = () => {
  const { data } = useDashboardData();
  const { setTrack, setQueue } = usePlayerStore();
  const [searchQuery, setSearchQuery] = useState('');

  const allPlaylists = useMemo(() => {
    if (!data) return [];
    return data.sections.flatMap(section => section.playlists);
  }, [data]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allPlaylists.filter(playlist => 
      playlist.title.toLowerCase().includes(query) || 
      playlist.description.toLowerCase().includes(query)
    );
  }, [searchQuery, allPlaylists]);

  const handlePlay = (playlist: Playlist) => {
    // Mock songs for now
    const mockSongs = [
      {
        id: `${playlist.id}-song-1`,
        title: `${playlist.title} Track 1`,
        artist: "Spotify Clone Artist",
        album: playlist.title,
        duration: 243,
        coverUrl: playlist.coverUrl,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      }
    ];
    setQueue(mockSongs);
    setTrack(mockSongs[0]);
  };

  return (
    <div className="px-6 py-4">
      {/* Search Header */}
      <div className="sticky top-16 z-20 bg-background-base/95 backdrop-blur-md -mx-6 px-6 py-4 mb-8 border-b border-white/5">
        <div className="relative max-w-xl group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subdued group-focus-within:text-text-bright transition-colors" size={20} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#242424] border border-transparent focus:border-white/20 p-3 pl-12 rounded-full outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subdued hover:text-text-bright transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {!searchQuery ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'Jazz', 'Classical', 'Chill', 'Workout', 'Mood', 'Party'].map((genre, i) => (
              <div 
                key={genre}
                className="aspect-square p-4 rounded-lg cursor-pointer overflow-hidden relative group transition-transform active:scale-95 shadow-xl"
                style={{ backgroundColor: `hsl(${i * 40}, 60%, 40%)` }}
              >
                <h3 className="text-2xl font-black tracking-tight">{genre}</h3>
                <img 
                  src={`https://picsum.photos/seed/${genre}/200/200`} 
                  className="absolute bottom-0 right-0 w-24 h-24 rotate-[25deg] translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500 shadow-2xl"
                  alt={genre}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredResults.map(playlist => (
                <div 
                  key={playlist.id}
                  className="bg-background-highlight p-4 rounded-md card-hover group cursor-pointer"
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-md shadow-2xl">
                    <img src={playlist.coverUrl} alt={playlist.title} className="object-cover w-full h-full" />
                    <button 
                      onClick={() => handlePlay(playlist)}
                      className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                    >
                      <Play size={24} fill="currentColor" className="ml-0.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-sm truncate mb-1">{playlist.title}</h3>
                  <p className="text-xs text-text-subdued line-clamp-2 leading-relaxed">{playlist.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <h2 className="text-2xl font-bold mb-2">No results found for "{searchQuery}"</h2>
              <p className="text-text-subdued text-sm">Please check your spelling or try different keywords.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
