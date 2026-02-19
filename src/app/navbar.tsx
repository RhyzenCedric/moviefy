"use client"; 
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function navbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const newQuery = searchParams.get("query") || "";
    const [query, setQuery] = useState(newQuery);

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
    <section className="fixed top-0 left-0 right-0 z-999 flex items-center justify-center bg-amber-200">
      <div className="box-border rounded-xl w-9/10 flex flex-row justify-center items-center gap-5 p-6 max-w-xl">
        <h1 className="text-4xl font-semibold hidden sm:block">Moviefy</h1>
        <div className="relative w-full">
          <span className="absolute right-2 top-1/2 -translate-y-1/2 sm:hidden text-gray-400 bg-(--background) p-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input className="border-2 border-black rounded-xl box-border w-full px-4 py-3 text-md placeholder-transparent bg-white sm:placeholder-gray-400" 
          placeholder="Search a song here to get recommendations!"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}></input>
        </div>
      </div>
    </section>
  </main>
  )
}
