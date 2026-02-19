const BASE_URL = process.env.TMDB_BASE_URL!;
const API_KEY = process.env.TMDB_API_KEY!;

type TMDBParams = Record<string, string | number | undefined>;

if (!BASE_URL || !API_KEY) throw new Error('TMDB env not set');

export async function fetchFromTMDB(
  endpoint: string,
  params?: TMDBParams
) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  // always include API key
  url.searchParams.set('api_key', API_KEY);

  // optional query params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString());
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error('TMDB returned non-JSON:', text);
    throw new Error('TMDB fetch failed');
  }
}
