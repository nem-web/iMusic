import { useQuery } from '@tanstack/react-query';
import { fetchTrendingTracks, getAudiusHost } from '../services/audiusClient';
import type { SectionData, Playlist, Song } from '../types';

interface DashboardData {
  featured: Playlist;
  sections: SectionData[];
}

// Helper to map Audius track to our Song interface
const mapAudiusTrackToSong = (track: any): Song => ({
  id: track.id,
  title: track.title,
  artist: track.user.name,
  album: track.title,
  duration: track.duration,
  url: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream?app_name=spotify_clone_modern`,
  coverUrl: track.artwork?.['480x480'] || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop'
});

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const host = await getAudiusHost();
      const tracks = await fetchTrendingTracks(50);
      
      // Update URLs to use the dynamic host
      const formattedSongs: Song[] = tracks.map((track: any) => {
        const song = mapAudiusTrackToSong(track);
        song.url = `${host}/v1/tracks/${track.id}/stream?app_name=spotify_clone_modern`;
        return song;
      });

      const featuredPlaylist: Playlist = {
        id: 'featured-1',
        title: 'Trending Now on Audius',
        description: 'The hottest tracks on the decentralized network.',
        coverUrl: formattedSongs[0]?.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        category: 'Trending Now',
        songs: formattedSongs.slice(0, 10)
      };

      const sections: SectionData[] = [
        {
          title: 'Top Hits',
          playlists: [
            {
              id: 'hits-1',
              title: 'Global Top 10',
              description: 'The most played tracks right now.',
              coverUrl: formattedSongs[10]?.coverUrl || 'https://picsum.photos/300',
              category: 'Trending Now',
              songs: formattedSongs.slice(10, 20)
            },
            {
              id: 'hits-2',
              title: 'Viral Tracks',
              description: 'Gaining momentum rapidly.',
              coverUrl: formattedSongs[20]?.coverUrl || 'https://picsum.photos/301',
              category: 'Trending Now',
              songs: formattedSongs.slice(20, 30)
            }
          ]
        },
        {
          title: 'Discover New Music',
          playlists: [
            {
              id: 'discover-1',
              title: 'Fresh Finds',
              description: 'New tracks you might like.',
              coverUrl: formattedSongs[30]?.coverUrl || 'https://picsum.photos/302',
              category: 'New Releases',
              songs: formattedSongs.slice(30, 40)
            },
            {
              id: 'discover-2',
              title: 'Underground',
              description: 'Hidden gems from Audius.',
              coverUrl: formattedSongs[40]?.coverUrl || 'https://picsum.photos/303',
              category: 'New Releases',
              songs: formattedSongs.slice(40, 50)
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
