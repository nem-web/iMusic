import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    isMuted, 
    setCurrentTime, 
    setDuration, 
    nextTrack, 
    repeatMode,
    setPlaying
  } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setCurrentTime, setDuration, nextTrack, repeatMode]);

  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Playback failed:", err);
          setPlaying(false);
        });
      }
    }
  }, [currentTrack, isPlaying, setPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const seek = (time: number) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return { seek };
};
