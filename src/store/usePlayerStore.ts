import { create } from 'zustand';
import type { Song } from '../types';

interface PlayerState {
  currentTrack: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  repeatMode: 'off' | 'track' | 'queue';
  isShuffle: boolean;
  currentTime: number;
  duration: number;
  
  // Actions
  setTrack: (track: Song) => void;
  setQueue: (songs: Song[]) => void;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: 'off' | 'track' | 'queue') => void;
  toggleShuffle: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  repeatMode: 'off',
  isShuffle: false,
  currentTime: 0,
  duration: 0,

  setTrack: (track) => set({ currentTrack: track, isPlaying: true, currentTime: 0 }),
  setQueue: (songs) => set({ queue: songs }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  
  nextTrack: () => {
    const { queue, currentTrack, isShuffle, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    let nextIndex = queue.findIndex((s) => s.id === currentTrack.id) + 1;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    if (nextIndex < queue.length) {
      set({ currentTrack: queue[nextIndex], currentTime: 0, isPlaying: true });
    } else if (repeatMode === 'queue') {
      set({ currentTrack: queue[0], currentTime: 0, isPlaying: true });
    } else {
      set({ isPlaying: false });
    }
  },

  previousTrack: () => {
    const { queue, currentTrack, currentTime } = get();
    if (!currentTrack || queue.length === 0) return;

    // If more than 3 seconds in, restart the track
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    const prevIndex = queue.findIndex((s) => s.id === currentTrack.id) - 1;
    if (prevIndex >= 0) {
      set({ currentTrack: queue[prevIndex], currentTime: 0, isPlaying: true });
    } else {
      set({ currentTrack: queue[queue.length - 1], currentTime: 0, isPlaying: true });
    }
  },
}));
