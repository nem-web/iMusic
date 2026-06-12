export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  url: string;
  coverUrl: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  category: 'Trending Now' | 'Made For You' | 'Recently Played' | 'New Releases' | 'Mood Mixes' | 'Top Charts';
  songs: Song[];
  ownerId?: string;
}

export interface SectionData {
  title: string;
  playlists: Playlist[];
}
