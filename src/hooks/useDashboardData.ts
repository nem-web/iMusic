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
      // Fetch multiple categories in parallel for a rich home page
      const [hindiTracks, punjabiTracks, englishTracks] = await Promise.all([
        fetchTrendingTracks('latest hindi hits', 20),
        fetchTrendingTracks('punjabi hits', 20),
        fetchTrendingTracks('global top 50 english', 20)
      ]);
      
      const formattedHindi: Song[] = Array.isArray(hindiTracks) ? hindiTracks.map(mapSaavnTrackToSong) : [];
      const formattedPunjabi: Song[] = Array.isArray(punjabiTracks) ? punjabiTracks.map(mapSaavnTrackToSong) : [];
      const formattedEnglish: Song[] = Array.isArray(englishTracks) ? englishTracks.map(mapSaavnTrackToSong) : [];

      const featuredPlaylist: Playlist = {
        id: 'featured-1',
        title: 'Bollywood Top 20',
        description: 'The hottest Hindi tracks right now.',
        coverUrl: formattedHindi[0]?.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        category: 'Trending Now',
        songs: formattedHindi
      };

      const sections: SectionData[] = [
        {
          title: 'Top Hits',
          playlists: [
            {
              id: 'hits-punjabi',
              title: 'Punjabi Fire',
              description: 'The most played Punjabi tracks.',
              coverUrl: formattedPunjabi[0]?.coverUrl || 'https://picsum.photos/300',
              category: 'Trending Now',
              songs: formattedPunjabi
            },
            {
              id: 'hits-english',
              title: 'Global Top 50',
              description: 'International chart toppers.',
              coverUrl: formattedEnglish[0]?.coverUrl || 'https://picsum.photos/301',
              category: 'Trending Now',
              songs: formattedEnglish
            }
          ]
        },
        {
          title: 'Discover New Music',
          playlists: [
            {
              id: 'discover-1',
              title: 'Fresh Hindi Finds',
              description: 'New Hindi tracks you might like.',
              coverUrl: formattedHindi[10]?.coverUrl || 'https://picsum.photos/302',
              category: 'New Releases',
              songs: formattedHindi.slice(10, 20)
            },
            {
              id: 'discover-2',
              title: 'Punjabi Underground',
              description: 'Hidden gems from Punjab.',
              coverUrl: formattedPunjabi[10]?.coverUrl || 'https://picsum.photos/303',
              category: 'New Releases',
              songs: formattedPunjabi.slice(10, 20)
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
