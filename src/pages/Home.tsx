import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { usePlayerStore } from '../store/usePlayerStore';
import type { Song, Playlist } from '../types';

interface CardProps {
  playlist: Playlist;
  isLoading?: boolean;
}

const MediaCard: React.FC<CardProps> = ({ playlist, isLoading }) => {
  const { currentTrack, isPlaying, setTrack, setQueue, togglePlay } = usePlayerStore();

  if (isLoading) {
    return (
      <div className="bg-background-highlight p-4 rounded-md w-44 shrink-0 animate-pulse">
        <div className="mb-4 aspect-square bg-white/5 rounded-md shadow-2xl" />
        <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    );
  }

  // Mock songs for now - in Phase 3/4 we'd fetch these
  const mockSongs: Song[] = [
    {
      id: `${playlist.id}-song-1`,
      title: `${playlist.title} Track 1`,
      artist: "Spotify Clone Artist",
      album: playlist.title,
      duration: 243,
      coverUrl: playlist.coverUrl,
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: `${playlist.id}-song-2`,
      title: `${playlist.title} Track 2`,
      artist: "Spotify Clone Artist",
      album: playlist.title,
      duration: 210,
      coverUrl: playlist.coverUrl,
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    }
  ];

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTrack?.id === mockSongs[0].id) {
      togglePlay();
    } else {
      setQueue(mockSongs);
      setTrack(mockSongs[0]);
    }
  };

  const isCurrentPlaylist = currentTrack?.album === playlist.title;

  return (
    <div className="bg-background-highlight p-4 rounded-md card-hover group cursor-pointer w-44 shrink-0">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-md shadow-2xl">
        <img src={playlist.coverUrl} alt={playlist.title} className="object-cover w-full h-full" />
        <button 
          onClick={handlePlay}
          className={`absolute bottom-2 right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black shadow-xl transition-all duration-300 ${isCurrentPlaylist && isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}
        >
          {isCurrentPlaylist && isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>
      <h3 className={`font-bold text-sm truncate mb-1 ${isCurrentPlaylist ? 'text-primary' : ''}`}>{playlist.title}</h3>
      <p className="text-xs text-text-subdued line-clamp-2 leading-relaxed">{playlist.description}</p>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold hover:underline cursor-pointer">{title}</h2>
      <span className="text-xs font-bold text-text-subdued hover:underline cursor-pointer">Show all</span>
    </div>
    <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
      {children}
    </div>
  </section>
);

const Home: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();
  const { currentTrack, isPlaying, togglePlay, setTrack, setQueue } = usePlayerStore();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2 text-red-500">Oops! Something went wrong.</h2>
        <p className="text-text-subdued">We couldn't load the music for you right now.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleHeroPlay = () => {
    if (data?.featured && data.featured.songs && data.featured.songs.length > 0) {
      const firstSong = data.featured.songs[0];
      if (currentTrack?.id === firstSong.id) {
        togglePlay();
      } else {
        setQueue(data.featured.songs);
        setTrack(firstSong);
      }
    }
  };

  return (
    <div className="px-6 py-4">
      {/* Featured Hero Banner */}
      {isLoading ? (
        <div className="mb-8 rounded-lg overflow-hidden h-64 bg-white/5 animate-pulse" />
      ) : (
        <div className="mb-8 relative rounded-lg overflow-hidden h-64 flex items-end p-8 group">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 via-indigo-600/40 to-transparent z-0" />
          <img 
            src={data?.featured.coverUrl} 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-700"
            alt="Banner"
          />
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider mb-2 block">Featured Playlist</span>
            <h1 className="text-7xl font-black mb-4 tracking-tighter">{data?.featured.title}</h1>
            <p className="text-text-bright/80 max-w-lg mb-6 text-sm font-medium">{data?.featured.description}</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleHeroPlay}
                className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                {currentTrack?.id === 'hero-song' && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                {currentTrack?.id === 'hero-song' && isPlaying ? 'Pause' : 'Play Now'}
              </button>
              <button className="glass-effect text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Section key={i} title="Loading...">
            {Array.from({ length: 6 }).map((_, j) => (
              <MediaCard key={j} playlist={{} as Playlist} isLoading />
            ))}
          </Section>
        ))
      ) : (
        data?.sections.map((section, idx) => (
          <Section key={idx} title={section.title}>
            {section.playlists.map((playlist) => (
              <MediaCard 
                key={playlist.id}
                playlist={playlist}
              />
            ))}
          </Section>
        ))
      )}
    </div>
  );
};

export default Home;
