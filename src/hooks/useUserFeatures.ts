import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export const useUserFeatures = () => {
  const { user } = useAuthStore();
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(new Set());

  // Fetch initial liked songs
  useEffect(() => {
    if (!user) {
      setLikedSongIds(new Set());
      return;
    }

    const fetchLikedSongs = async () => {
      const { data, error } = await supabase
        .from('liked_songs')
        .select('song_id')
        .eq('user_id', user.id);
        
      if (!error && data) {
        setLikedSongIds(new Set(data.map(d => d.song_id)));
      }
    };

    fetchLikedSongs();
  }, [user]);

  const toggleLike = useCallback(async (songId: string) => {
    if (!user) {
      toast.error('Please log in to like songs');
      return;
    }

    const isLiked = likedSongIds.has(songId);
    
    // Optimistic update
    setLikedSongIds(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });

    try {
      if (isLiked) {
        await supabase
          .from('liked_songs')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', songId);
        toast.success('Removed from Liked Songs');
      } else {
        await supabase
          .from('liked_songs')
          .insert({ user_id: user.id, song_id: songId });
        toast.success('Added to Liked Songs');
      }
    } catch (error) {
      // Revert on failure
      setLikedSongIds(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.add(songId);
        else newSet.delete(songId);
        return newSet;
      });
      toast.error('Failed to update liked songs');
    }
  }, [user, likedSongIds]);

  const isLiked = useCallback((songId: string) => {
    return likedSongIds.has(songId);
  }, [likedSongIds]);

  return { toggleLike, isLiked };
};
