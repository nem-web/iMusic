import React from 'react';
import { 
  Play, 
  Pause,
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX,
  Mic2, 
  ListMusic, 
  MonitorSpeaker, 
  Maximize2,
  Heart
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useUserFeatures } from '../hooks/useUserFeatures';

const Player: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    volume, 
    setVolume,
    isMuted,
    toggleMute,
    nextTrack,
    previousTrack,
    repeatMode,
    setRepeatMode,
    isShuffle,
    toggleShuffle
  } = usePlayerStore();
  
  const { seek } = useAudioPlayer();
  const { isLiked, toggleLike } = useUserFeatures();

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  if (!currentTrack) return <div className="h-24 bg-black border-t border-white/5" />;

  const trackIsLiked = isLiked(currentTrack.id);

  return (
    <div className="h-16 md:h-24 bg-black flex items-center justify-between px-2 md:px-4 border-t border-white/5 z-40 fixed md:static bottom-16 md:bottom-0 left-0 right-0">
      {/* Current Song Info */}
      <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-[30%]">
        <div className="w-10 h-10 md:w-14 md:h-14 bg-background-highlight rounded overflow-hidden shadow-lg shrink-0">
          <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col overflow-hidden min-w-0">
          <span className="text-sm font-medium hover:underline cursor-pointer truncate text-text-bright">
            {currentTrack.title}
          </span>
          <span className="text-xs text-text-subdued hover:underline hover:text-text-bright cursor-pointer truncate">
            {currentTrack.artist}
          </span>
        </div>
        <button 
          onClick={() => toggleLike(currentTrack.id)}
          className={`transition-colors shrink-0 hidden sm:block ${trackIsLiked ? 'text-primary' : 'text-text-subdued hover:text-text-bright'}`}
        >
          <Heart size={20} fill={trackIsLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center gap-1 md:gap-2 w-auto md:max-w-[40%] md:w-full">
        <div className="flex items-center gap-4 md:gap-6 text-text-subdued">
          <button 
            onClick={toggleShuffle}
            className={`transition-colors hidden md:block ${isShuffle ? 'text-primary' : 'hover:text-text-bright'}`}
          >
            <Shuffle size={20} />
          </button>
          <button 
            onClick={previousTrack}
            className="hover:text-text-bright transition-colors hidden sm:block"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-8 h-8 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <button 
            onClick={nextTrack}
            className="hover:text-text-bright transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button 
            onClick={() => setRepeatMode(repeatMode === 'off' ? 'queue' : repeatMode === 'queue' ? 'track' : 'off')}
            className={`transition-colors hidden md:block ${repeatMode !== 'off' ? 'text-primary' : 'hover:text-text-bright'} relative`}
          >
            <Repeat size={20} />
            {repeatMode === 'track' && <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-primary text-black rounded-full w-3 h-3 flex items-center justify-center">1</span>}
          </button>
        </div>
        
        <div className="hidden md:flex items-center gap-2 w-full max-w-md group">
          <span className="text-xs text-text-subdued min-w-[32px] text-right">
            {formatTime(currentTime)}
          </span>
          <input 
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-primary transition-all [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
          />
          <span className="text-xs text-text-subdued min-w-[32px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Extra Options */}
      <div className="hidden md:flex items-center justify-end gap-3 w-[30%] text-text-subdued">
        <button className="hover:text-text-bright transition-colors hidden lg:block">
          <Mic2 size={18} />
        </button>
        <button className="hover:text-text-bright transition-colors">
          <ListMusic size={18} />
        </button>
        <button className="hover:text-text-bright transition-colors hidden lg:block">
          <MonitorSpeaker size={18} />
        </button>
        <div className="flex items-center gap-2 w-24 group">
          <button onClick={toggleMute} className="hover:text-text-bright transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-primary transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
          />
        </div>
        <button className="hover:text-text-bright transition-colors hidden lg:block">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Player;
