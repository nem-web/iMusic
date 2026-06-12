import { useQuery } from '@tanstack/react-query';
import { fetchTrendingTracks } from '../services/jiosaavnClient';
import type { SectionData, Playlist, Song } from '../types';

interface DashboardData {
  featured: Playlist;
  sections: SectionData[];
}

// Helper to map JioSaavn track to our Song interface
const mapSaavnTrackToSong = (track: any): Song => {
  const getHighQualityUrl = () => {
    if (track.downloadUrl && track.downloadUrl.length > 0) {
      return track.downloadUrl[track.downloadUrl.length - 1].url;
    }
    return '';
  };

  const getHighQualityImage = () => {
    if (track.image && track.image.length > 0) {
      return track.image[track.image.length - 1].url;
    }
    return 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop';
  };

  const getArtists = () => {
    if (track.artists?.primary && track.artists.primary.length > 0) {
      return track.artists.primary.map((a: any) => a.name).join(', ');
    }
    return 'Unknown Artist';
  };

  return {
    id: track.id,
    title: (track.name || track.title || 'Unknown').replace(/&quot;/g, '"'),
    artist: getArtists(),
    album: track.album?.name || 'Single',
    duration: parseInt(track.duration, 10) || 0,
    url: getHighQualityUrl(),
    coverUrl: getHighQualityImage()
  };
};

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      // Fetch massive amounts of data for a rich library (1000+ tracks total potential)
      const fetchCategories = [
        fetchTrendingTracks('top bollywood 2024', 100),
        fetchTrendingTracks('latest punjabi', 100),
        fetchTrendingTracks('global top 50 english', 100),
        fetchTrendingTracks('arijit singh hits', 100),
        fetchTrendingTracks('lofi chill hindi', 100),
        fetchTrendingTracks('shreya ghoshal', 100),
        fetchTrendingTracks('90s bollywood romantic', 100),
        fetchTrendingTracks('honey singh badshah', 100),
        fetchTrendingTracks('gym workout bass', 100),
        fetchTrendingTracks('bhajan devotional', 100)
      ];

      const results = await Promise.all(fetchCategories);
      
      // Helper to deduplicate tracks by title
      const deduplicate = (tracks: any[]) => {
        if (!Array.isArray(tracks)) return [];
        const unique = [];
        const seen = new Set();
        for (const t of tracks) {
          const s = mapSaavnTrackToSong(t);
          const title = s.title.toLowerCase().trim();
          if (!seen.has(title)) {
            seen.add(title);
            unique.push(s);
          }
        }
        return unique;
      };

      const formattedHindi = deduplicate(results[0]);
      const formattedPunjabi = deduplicate(results[1]);
      const formattedEnglish = deduplicate(results[2]);
      const formattedArijit = deduplicate(results[3]);
      const formattedLofi = deduplicate(results[4]);
      const formattedShreya = deduplicate(results[5]);
      const formatted90s = deduplicate(results[6]);
      const formattedRap = deduplicate(results[7]);
      const formattedWorkout = deduplicate(results[8]);
      const formattedDevotional = deduplicate(results[9]);

      const featuredPlaylist: Playlist = {
        id: 'featured-1',
        title: 'Bollywood Mega Hits',
        description: 'The absolute hottest Hindi tracks trending right now across all platforms.',
        coverUrl: formattedHindi[0]?.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        category: 'Trending Now',
        songs: formattedHindi
      };

      const sections: SectionData[] = [
        {
          title: 'Top Albums & Artists',
          playlists: [
            {
              id: 'hits-arijit',
              title: 'Arijit Singh Essentials',
              description: 'The king of romance.',
              coverUrl: formattedArijit[0]?.coverUrl || 'https://picsum.photos/300',
              category: 'Trending Now',
              songs: formattedArijit
            },
            {
              id: 'hits-punjabi',
              title: 'Punjabi Fire',
              description: 'The most played Punjabi tracks.',
              coverUrl: formattedPunjabi[0]?.coverUrl || 'https://picsum.photos/301',
              category: 'Trending Now',
              songs: formattedPunjabi
            },
            {
              id: 'hits-english',
              title: 'Global Top 50',
              description: 'International chart toppers.',
              coverUrl: formattedEnglish[0]?.coverUrl || 'https://picsum.photos/302',
              category: 'Trending Now',
              songs: formattedEnglish
            },
            {
              id: 'hits-lofi',
              title: 'Hindi Lofi & Chill',
              description: 'Relax with lo-fi beats.',
              coverUrl: formattedLofi[0]?.coverUrl || 'https://picsum.photos/303',
              category: 'Trending Now',
              songs: formattedLofi
            },
            {
              id: 'hits-shreya',
              title: 'Shreya Ghoshal Melodies',
              description: 'Queen of Indian playback.',
              coverUrl: formattedShreya[0]?.coverUrl || 'https://picsum.photos/304',
              category: 'Trending Now',
              songs: formattedShreya
            }
          ]
        },
        {
          title: 'Moods & Eras',
          playlists: [
            {
              id: 'mood-90s',
              title: '90s Bollywood Romance',
              description: 'Nostalgic love songs.',
              coverUrl: formatted90s[0]?.coverUrl || 'https://picsum.photos/305',
              category: 'Mood Mixes',
              songs: formatted90s
            },
            {
              id: 'mood-rap',
              title: 'Desi Hip Hop',
              description: 'Rap anthems and bangers.',
              coverUrl: formattedRap[0]?.coverUrl || 'https://picsum.photos/306',
              category: 'Mood Mixes',
              songs: formattedRap
            },
            {
              id: 'mood-workout',
              title: 'Gym & Workout',
              description: 'High energy tracks.',
              coverUrl: formattedWorkout[0]?.coverUrl || 'https://picsum.photos/307',
              category: 'Mood Mixes',
              songs: formattedWorkout
            },
            {
              id: 'mood-devotional',
              title: 'Devotional & Bhajans',
              description: 'Peaceful mornings.',
              coverUrl: formattedDevotional[0]?.coverUrl || 'https://picsum.photos/308',
              category: 'Mood Mixes',
              songs: formattedDevotional
            }
          ]
        }
      ];

      return {
        featured: featuredPlaylist,
        sections
      };
    },
  });
};
