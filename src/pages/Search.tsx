import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Play, Clock, Pause } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchTracks } from '../services/jiosaavnClient';
import type { Song } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';
import debounce from 'lodash.debounce';

const mapSaavnTrackToSong = (track: any): Song => {
  let cleanUrl = track.url || '';
  if (cleanUrl.includes('preview.saavncdn.com')) {
    cleanUrl = cleanUrl.replace('preview.saavncdn.com', 'aac.saavncdn.com').replace('_96_p', '_320');
  }

  return {
    id: track.id,
    title: track.title.replace(/&quot;/g, '"'),
    artist: track.artists || track.subtitle || 'Unknown Artist',
    album: track.album || 'Single',
    duration: parseInt(track.duration, 10) || 0,
    url: cleanUrl,
    coverUrl: track.image?.replace('50x50', '500x500') || track.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop'
  };
};

const Search: React.FC = () => {
  const { setTrack, setQueue, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search input
  useEffect(() => {
    const handler = debounce((value: string) => {
      setDebouncedQuery(value);
    }, 500);
    handler(searchInput);
    return () => handler.cancel();
  }, [searchInput]);

  const { data: searchResults, isLoading } = useQuery<Song[]>({
    queryKey: ['searchTracks', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const rawTracks = await searchTracks(debouncedQuery, 50); // Increased limit to 50
      if (!Array.isArray(rawTracks)) return [];
      return rawTracks.map(mapSaavnTrackToSong);
    },
    enabled: !!debouncedQuery.trim()
  });

  const handlePlay = (song: Song) => {
    if (currentTrack?.id === song.id) {
      togglePlay();
    } else {
      if (searchResults) {
        setQueue(searchResults);
      } else {
        setQueue([song]);
      }
      setTrack(song);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-6 py-4">
      {/* Search Header */}
      <div className="sticky top-16 z-20 bg-background-base/95 backdrop-blur-md -mx-6 px-6 py-4 mb-8 border-b border-white/5">
        <div className="relative max-w-xl group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subdued group-focus-within:text-text-bright transition-colors" size={20} />
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for songs, artists, or genres..."
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#242424] border border-transparent focus:border-white/20 p-3 pl-12 rounded-full outline-none transition-all text-text-bright"
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subdued hover:text-text-bright transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {!debouncedQuery ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-text-bright">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {['Bollywood', 'Punjabi', 'Pop', 'Hip-Hop', 'Electronic', 'Lo-Fi', 'Rock', 'Jazz', 'Chill', 'Party'].map((genre, i) => (
              <div 
                key={genre}
                onClick={() => setSearchInput(genre)}
                className="aspect-square p-4 rounded-lg cursor-pointer overflow-hidden relative group transition-transform hover:scale-105 active:scale-95 shadow-xl"
                style={{ backgroundColor: `hsl(${i * 40}, 60%, 40%)` }}
              >
                <h3 className="text-2xl font-black tracking-tight text-white">{genre}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pb-24">
          <h2 className="text-2xl font-bold mb-6 text-text-bright">Top Results</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2 rounded-md bg-white/5 animate-pulse">
                  <div className="w-12 h-12 bg-white/10 rounded-sm" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-3 bg-white/10 rounded w-1/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="flex flex-col w-full">
              <div className="grid grid-cols-[16px_minmax(120px,_1fr)_minmax(120px,_1fr)_minmax(120px,_1fr)_minmax(50px,_80px)] gap-4 px-4 py-2 text-text-subdued border-b border-white/10 text-sm">
                <div className="text-center">#</div>
                <div>Title</div>
                <div className="hidden md:block">Artist</div>
                <div className="hidden md:block">Album</div>
                <div className="flex justify-end"><Clock size={16} /></div>
              </div>
              
              <div className="mt-2 space-y-1">
                {searchResults.map((song, index) => {
                  const isCurrentSong = currentTrack?.id === song.id;
                  
                  return (
                    <div 
                      key={song.id}
                      onClick={() => handlePlay(song)}
                      className={`grid grid-cols-[16px_minmax(120px,_1fr)_minmax(120px,_1fr)_minmax(120px,_1fr)_minmax(50px,_80px)] gap-4 px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer items-center transition-colors ${isCurrentSong ? 'bg-white/5' : ''}`}
                    >
                      <div className="text-center text-text-subdued relative w-4 h-4 flex items-center justify-center">
                        <span className={`group-hover:opacity-0 ${isCurrentSong ? 'text-primary' : ''}`}>
                          {index + 1}
                        </span>
                        <button className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-text-bright">
                           {isCurrentSong && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={song.coverUrl} alt={song.title} className="w-10 h-10 object-cover rounded-sm shrink-0" />
                        <span className={`truncate text-sm font-medium ${isCurrentSong ? 'text-primary' : 'text-text-bright'}`}>
                          {song.title}
                        </span>
                      </div>
                      
                      <div className="hidden md:block truncate text-sm text-text-subdued group-hover:text-text-bright">
                        {song.artist}
                      </div>
                      
                      <div className="hidden md:block truncate text-sm text-text-subdued group-hover:text-text-bright">
                        {song.album}
                      </div>
                      
                      <div className="text-right text-sm text-text-subdued">
                        {formatTime(song.duration)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <h2 className="text-2xl font-bold mb-2 text-text-bright">No results found for "{debouncedQuery}"</h2>
              <p className="text-text-subdued text-sm">Please check your spelling or try different keywords.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
