"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import type { iTunesSong } from '../../.next/dev/types/itunes';
import type { TMDBMovie } from '../../.next/dev/types/movies';

type Props ={
    movie:TMDBMovie;
    song: iTunesSong;
    onClose: () => void;
}

export default function RecommendationsPopUp({ song, onClose }: Props) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filmPopupVisible, setFilmPopupVisible] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState<TMDBMovie | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('/api/moviereco');
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  return (
    <main>
    <div className='sm:hidden fixed inset-0 z-40'>
      <div className='absolute inset-0 bg-black/50 pointer-events-none' />
      <div className="sm:hidden fixed inset-0 z-40 flex items-center justify-center">
        <div className=" bg-white w-9/10 max-w-lg fixed top-30 bottom-20 left-1/2 -translate-x-1/2 overflow-y-auto border rounded-xl pointer-events-auto">
          <button className=' fixed top-5 left-5' onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

            <div className='m-5'>
                <h1 className=" text-center text-xl font-bold">Films with the same vibe...</h1>
            </div>

            <div className="p-4">            
                {loading ? (
                <p>Loading...</p>
                ) : (
                <ul className="space-y-2 grid grid-cols-3 max-[440px]:grid-cols-2 gap-y-4">
                    {movies.map(movie => (
                    <li key={movie.id} className="flex justify-center items-center m-0">
                        {movie.poster_path && (
                          <button className='cursor-pointer' onClick={() => {setFilmPopupVisible(true); setSelectedMovie(movie);}}>
                              <img
                                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                  alt={movie.title}
                                  className="w-30 rounded"
                              />
                          </button>
                        )}
                        {/* <span>{movie.title}</span> */}
                    </li>
                    ))}
                </ul>
                )}
            </div>
        </div>
      </div>
    </div>

        {filmPopupVisible && selectedMovie && (
           <div className=' fixed inset-0 z-50 flex items-center justify-center bg-black/70 '>
                <div onClick={(e) => e.stopPropagation()} className='sm:w-8/10 sm:h-8/10'>
                  <iframe
                    src={`https://vidking.net/embed/movie/${selectedMovie.id}?muted=true`}
                    className="w-full h-full"
                    allow="fullscreen; picture-in-picture"
                    allowFullScreen
                  />

                </div>
           </div> 
        )}
    </main>
  );
}
