"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { iTunesSong } from "../../../.next/dev/types/itunes";
import type { TMDBMovie } from "../../../.next/dev/types/movies";
import AudioPlayerModal from "../AudioPlayerModal";
import RecommendationsPopUp from "../RecommendationsPopUp";
import { categorizeMood } from "../../lib/moodCategorizer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
  movie: TMDBMovie;
  song: iTunesSong;
  onClose: () => void;
};

export default function Results({ movie, song, onClose }: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<iTunesSong[]>([]);
  const [selectedSong, setSelectedSong] = useState<iTunesSong | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [filmPopupVisible, setFilmPopupVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  // Fetch iTunes search results
  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search API request failed");
        const data: iTunesSong[] = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) return <p>Please enter a search term.</p>;

  const fetchMovies = async (song: iTunesSong, maxEnergy: number, finalTempo: string) => {
    setLoading(true);
    try {
      const mood = categorizeMood(maxEnergy, finalTempo as "slow" | "mid" | "fast");
      console.log("🎵 Selected song:", song.trackName, "| Genre:", song.primaryGenreName);
      console.log("🎶 Analysis:", { maxEnergy, finalTempo });
      console.log("🟢 Categorized mood:", mood);

      const res = await fetch(
        `/api/moviereco?mood=${mood}&energy=${maxEnergy}&tempo=${finalTempo}&genre=${encodeURIComponent(
          song.primaryGenreName || ""
        )}`
      );
      const data = await res.json();
      console.log("🎬 Recommendations fetched:", data.recommendations);

      const newMovies = data.recommendations.map((r: any) => r.movie);

      setMovies((prev) => {
        const isSame = prev.length === newMovies.length && prev.every((m, i) => m.id === newMovies[i].id);
        return isSame ? prev : newMovies;
      });
    } catch (err) {
      console.error("Fetch movies error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`pt-25 h-screen overflow-hidden transition-all duration-300 ${selectedSong ? "sm:flex" : "block"}`}>
      {/* Song list */}
      <section className={`bg-white overflow-y-auto no-scrollbar border-r-2 ${selectedSong ? "sm:w-1/2 h-full" : "w-full h-full"}`}>
        {!loading && results.length === 0 && query && <p>No results found.</p>}
        <ul className="p-5">
          {results.map((song) => (
            <li
              key={song.trackId}
              className="first:mt-0 last:mb-0"
              onClick={() => {
                setSelectedSong(song);
                setPopupVisible(true);
              }}
            >
              <div className="border-t-2 flex p-2.5 gap-1.5 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in-out">
                <div className="flex items-center justify-center">
                  <img
                    src={song.artworkUrl100}
                    alt={song.trackName}
                    className="w-16 h-16 aspect-square object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center ml-2">
                  <h2 className="text-lg font-medium line-clamp-1">{song.trackName}</h2>
                  <h3 className="text-md font-light line-clamp-1">{song.collectionName}</h3>
                  <h4 className="text-sm font-extralight text-gray-600">{song.artistName}</h4>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Movie recommendations */}
      <section className="border-l-2 bg-white overflow-y-auto sm:w-1/2 h-full no-scrollbar p-5">
      <div className="flex items-center">
          <button className='hover:cursor-pointer' onClick={() => {setSelectedSong(null); setMovies([]); setPopupVisible(false);}}>
            <FontAwesomeIcon icon={faArrowRight}/>
          </button> 
      </div>
        <div className="m-5">
          <h1 className="text-center text-xl font-bold">Films with the same vibe...</h1>
        </div>
        <div className="">
          {loading ? (
            <p>Loading...</p>
          ) : movies.length === 0 ? (
            <p className="text-center text-gray-500">Play a song to see movie recommendations</p>
          ) : (
            <ul className="space-y-2 grid grid-cols-3 max-[440px]:grid-cols-2 gap-y-4 gap-x-4">
              {movies.map((movie) => (
                <li key={movie.id} className="flex justify-center items-center m-0">
                  {movie.poster_path && (
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setFilmPopupVisible(true);
                        setSelectedMovie(movie);
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-30 md:w-75 rounded"
                      />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Film modal */}
      {filmPopupVisible && selectedMovie && (
        <div
          onClick={() => setFilmPopupVisible(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <div onClick={(e) => e.stopPropagation()} className="w-8/10 h-8/10">
            <iframe
              src={`https://vidking.net/embed/movie/${selectedMovie.id}?muted=true`}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* Recommendations popup */}
      {selectedSong && popupVisible && (
        <RecommendationsPopUp
          movie={movies[0] ?? null}
          song={selectedSong}
          onClose={() => setPopupVisible(false)}
        />
      )}


      {/* Audio player modal */}
      {selectedSong && popupVisible && (
        <AudioPlayerModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
          onAnalysisComplete={({ maxEnergy, finalTempo }) =>
            fetchMovies(selectedSong, maxEnergy, finalTempo)
          }
        />
      )}
    </main>
  );
}
