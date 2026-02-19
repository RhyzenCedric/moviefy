// itunes.ts

export type iTunesSong = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;

  previewUrl: string;

  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;

  trackTimeMillis?: number;
  primaryGenreName?: string;

  releaseDate?: string;
  trackViewUrl?: string;
};
