// src/lib/iTunesGenreMap.ts

export type GenreCategory =
  | "pop"
  | "rock"
  | "electronic"
  | "hiphop"
  | "folk"
  | "jazz"
  | "country"
  | "classical"
  | "blues"
  | "reggae"
  | "rnb"
  | "other";

// Map common iTunes primaryGenreName values to our categories
export const ITUNES_GENRE_MAP: Record<string, GenreCategory> = {
  // Pop
  "pop": "pop",
  "dance": "pop",
  "synth-pop": "pop",
  "k-pop": "pop",

  // Rock
  "rock": "rock",
  "alternative": "rock",
  "hard rock": "rock",
  "metal": "rock",
  "punk": "rock",

  // Electronic
  "electronic": "electronic",
  "edm": "electronic",
  "house": "electronic",
  "techno": "electronic",
  "trance": "electronic",

  // Hip-hop / Rap / R&B
  "hip-hop/rap": "hiphop",
  "rap": "hiphop",
  "r&b/soul": "rnb",
  "funk": "rnb",

  // Folk / Singer-Songwriter
  "folk": "folk",
  "singer-songwriter": "folk",
  "acoustic": "folk",

  // Jazz / Blues / Classical
  "jazz": "jazz",
  "blues": "blues",
  "classical": "classical",
  "opera": "classical",

  // Country
  "country": "country",

  // Reggae / World
  "reggae": "reggae",
  "world": "other",

  // Catch-all
  "unknown": "other",
};
