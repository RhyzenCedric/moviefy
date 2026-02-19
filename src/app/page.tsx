"use client";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      handleSearch();
    } 
  }

  const handleSearch = () => {
    if(query.trim() !==""){
      router.push(`/results?query=${encodeURIComponent(query)}`);
    }
  }

  return (
  <main>
    <section className=" min-h-screen flex items-center justify-center">
      <div className="box-border border rounded-xl w-9/10 flex flex-col justify-center items-center gap-5 p-6 max-w-xl bg-amber-200">
        <h1 className="text-4xl font-bold">Moviefy</h1>
        <h2 className="text-2xl text-center font-medium sm:text-left">Discover films through music.</h2>
        <div className="relative w-full bg-white rounded-xl">
          <span className="absolute right-2 top-1/2 -translate-y-1/2 sm:hidden text-gray-400 bg-(--background) p-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input className="border-2 border-black rounded-xl box-border w-full px-4 py-3 text-md placeholder-transparent sm:placeholder-gray-400" 
          placeholder="Search a song here to get recommendations!"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}></input>
        </div>
        <div className="block sm:hidden text-center">
          <p>Search a song above to get recommendations!</p>
        </div>
      </div>
    </section>
    <footer className=" fixed bottom-0 left-0 right-0 bg-black text-white text-center p-4">
      <h3>A Practice Project of <a href="https://rhy-folio.vercel.app/" target="_blank" rel="noopener noreferrer">Zen</a> utilizing Tailwind and TypeScript © 2026</h3>
    </footer>
  </main>
  );
}
