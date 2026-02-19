// src/app/api/moviereco/route.ts
import { fetchFromTMDB } from '@/lib/tmdb';
import { NextResponse } from 'next/server';
import { MOOD_TO_GENRES } from '@/lib/SongToMovieMap';
import type { SongAnalysis } from '../../../../.next/dev/types/recommendations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Get song analysis params
    const mood = (searchParams.get('mood') || 'calm') as SongAnalysis['mood'];
    const energy = Number(searchParams.get('energy') || 0.5) as SongAnalysis['maxEnergy'];
    const tempo = (searchParams.get('tempo') || 'mid') as SongAnalysis['finalTempo'];
    const genre = searchParams.get('genre') || '';

    // Map mood to TMDB genre IDs
    const withGenres = MOOD_TO_GENRES[mood as keyof typeof MOOD_TO_GENRES] ?? MOOD_TO_GENRES.calm;

    // 1. Fetch candidate movies
    const data = await fetchFromTMDB('/discover/movie', {
      with_genres: withGenres.join(','),
      sort_by: 'popularity.desc',
      page: '1',
    });

    // Filter out movies without a poster
    const candidates = (data.results || []).filter((m: any) => m.poster_path).slice(0, 50); // fetch extra to ensure enough with posters

    // 2. Score each candidate
    const recommendations = candidates.map((movie: any) => {
      let score = 0;
      const reasons: string[] = [];

      const movieGenres: number[] = movie.genre_ids || [];

      // Genre match
      const genreMatchCount = movieGenres.filter((id) => withGenres.includes(id)).length;
      const genreScore = genreMatchCount / withGenres.length; // 0-1
      score += 0.4 * genreScore;
      if (genreScore > 0) reasons.push(`Matches ${Math.round(genreScore * 100)}% of mood genres`);

      // Energy heuristic
      if (energy >= 0.5) {
        score += 0.25;
        reasons.push('High-energy vibe (from song analysis)');
      } else if (energy <= 0.3) {
        score += 0.15;
        reasons.push('Low-energy vibe (from song analysis)');
      } else {
        score += 0.1;
        reasons.push('Medium-energy vibe (from song analysis)');
      }

      // Tempo bonus
      if (tempo === 'fast') {
        score += 0.05;
        reasons.push('Fast tempo song bonus');
      } else if (tempo === 'slow') {
        score += 0.05;
        reasons.push('Slow tempo song bonus');
      }

      return {
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          genreIds: movie.genre_ids,
        },
        score,
        reasons,
      };
    });

    // 3. Rank + trim top 15
    const ranked = recommendations
      .sort((a: typeof recommendations[0], b: typeof recommendations[0]) => b.score - a.score)
      .slice(0, 15);

    console.log('🎬 Generated Recommendations:', ranked);

    return NextResponse.json({ mood, energy, tempo, recommendations: ranked });
  } catch (err: any) {
    console.error('API Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
