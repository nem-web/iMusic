import { useQuery } from '@tanstack/react-query';
import { fetchTrendingTracks } from '../services/jiosaavnClient';
import type { SectionData, Playlist, Song } from '../types';

interface DashboardData {
  featured: Playlist;
  sections: SectionData[];
}

// Helper to map JioSaavn track to our Song interface
const mapSaavnTrackToSong = (track: any): Song => {
  // Decode HTML entities if needed, though mostly handled by React
  let cleanUrl = track.url || '';
  if (cleanUrl.includes('preview.saavncdn.com')) {
    cleanUrl = cleanUrl.replace('preview.saavncdn.com', 'aac.saavncdn.com').replace('_96_p', '_320');
  }

  return {
    id: track.id,
    title: track.title.replace(/&quot;/g, '"'),
    artist: track.artists || track.subtitle || 'Unknown Artist',
    album: track.album || 'Single',
    duration: parseInt(track.duration, 10),
    url: cleanUrl,
    coverUrl: track.image?.replace('50x50', '500x500') || track.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop'
  };
};

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      // Fetch multiple categories in parallel for a rich home page with hundreds of songs
      const [hindiTracks, punjabiTracks, englishTracks, arijitTracks, lofiTracks] = await Promise.all([
        fetchTrendingTracks('top bollywood 2024', 50),
        fetchTrendingTracks('latest punjabi', 50),
        fetchTrendingTracks('global top 50 english', 50),
        fetchTrendingTracks('arijit singh hits', 50),
        fetchTrendingTracks('lofi chill hindi', 50)
      ]);
      
      const formattedHindi: Song[] = Array.isArray(hindiTracks) ? hindiTracks.map(mapSaavnTrackToSong) : [];
      const formattedPunjabi: Song[] = Array.isArray(punjabiTracks) ? punjabiTracks.map(mapSaavnTrackToSong) : [];
      const formattedEnglish: Song[] = Array.isArray(englishTracks) ? englishTracks.map(mapSaavnTrackToSong) : [];
      const formattedArijit: Song[] = Array.isArray(arijitTracks) ? arijitTracks.map(mapSaavnTrackToSong) : [];
      const formattedLofi: Song[] = Array.isArray(lofiTracks) ? lofiTracks.map(mapSaavnTrackToSong) : [];

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
          title: 'Top Albums & Playlists',
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
            }
          ]
        },
        {
          title: 'More Bollywood & Hindi',
          playlists: [
            {
              id: 'discover-1',
              title: 'Fresh Hindi Finds',
              description: 'New Hindi tracks you might like.',
              coverUrl: formattedHindi[10]?.coverUrl || 'https://picsum.photos/304',
              category: 'New Releases',
              songs: formattedHindi.slice(10, 30)
            },
            {
              id: 'discover-2',
              title: 'Bollywood Party',
              description: 'Dance to these hits.',
              coverUrl: formattedHindi[20]?.coverUrl || 'https://picsum.photos/305',
              category: 'New Releases',
              songs: formattedHindi.slice(20, 40)
            },
            {
              id: 'discover-3',
              title: 'Heartbreak Hits',
              description: 'Sad songs for the soul.',
              coverUrl: formattedArijit[10]?.coverUrl || 'https://picsum.photos/306',
              category: 'New Releases',
              songs: formattedArijit.slice(10, 30)
            }
          ]
        },
        {
          title: 'Punjabi & Global',
          playlists: [
            {
              id: 'punjabi-2',
              title: 'Punjabi Underground',
              description: 'Hidden gems from Punjab.',
              coverUrl: formattedPunjabi[10]?.coverUrl || 'https://picsum.photos/307',
              category: 'New Releases',
              songs: formattedPunjabi.slice(10, 30)
            },
            {
              id: 'english-2',
              title: 'Pop Hits',
              description: 'The biggest English pop tracks.',
              coverUrl: formattedEnglish[10]?.coverUrl || 'https://picsum.photos/308',
              category: 'New Releases',
              songs: formattedEnglish.slice(10, 30)
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
