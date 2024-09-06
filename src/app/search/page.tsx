"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";

const Page = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Debounce search function
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setResults([]); // Clear results before fetching new data
    setPage(1); // Reset page to 1 for new search

    try {
      const response = await fetch(`/api/search/${query}/${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setResults(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Load more results
  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/search/${query}/${nextPage}`);
      if (!response.ok) {
        throw new Error("Failed to fetch more results");
      }

      const data = await response.json();
      setResults((prevResults) => [...prevResults, ...data.results]);
      setPage(nextPage);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle scroll event with delay
  const handleScroll = useCallback(() => {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    const timeout = setTimeout(() => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.offsetHeight;

      if (scrollPosition + 200 >= bottomPosition && !loading && !loadingMore) {
        handleLoadMore();
      }
    }, 300);

    setScrollTimeout(timeout);
  }, [loading, loadingMore, scrollTimeout]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSlideClick = (id: number, type: string) => {
    router.push(`/${type}/${id}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/path/to/your/background-image.jpg)" }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      <div className="relative z-10 p-4 mt-5 md:px-40">
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search for movies or TV shows..."
            className="flex-grow p-3 h-14 rounded-l-lg bg-zinc-900 text-white focus:outline-none inner-focus-ring"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-500 p-3 h-14 w-14 rounded-r-lg hover:bg-yellow-600 flex items-center justify-center"
          >
            <FaSearch className="text-black" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center w-full h-[100vh]">
            <div className="loader"></div>
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {results
              .filter(item => item.media_type === "movie" || item.media_type === "tv")
              .map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() =>
                    handleSlideClick(
                      item.id,
                      item.media_type === "tv" ? "tv_series_detail" : "movie_detail"
                    )
                  }
                >
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/images/poster-holder.jpg"
                    }
                    alt={item.title || item.name}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />

                  <h2
                    className="mt-2 text-lg font-semibold text-center"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 2,
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                    }}
                  >
                    {item.title || item.name}
                  </h2>
                </div>
              ))}
          </div>
        )}
        {!loading && results.length === 0 && searchPerformed && (
          <div className=" text-center justify-center w-full h-full">
            No results found.
          </div>
        )}

        {loadingMore && (
          <div className="flex items-center justify-center my-5">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
