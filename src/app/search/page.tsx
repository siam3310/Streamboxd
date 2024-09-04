"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const Page = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false); // Add state to track search
  const router = useRouter();

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [page]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setSearchPerformed(true); // Indicate that a search has been performed

    try {
      const response = await fetch(`/api/search/${query}/${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      console.log(data);
      setResults(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleSlideClick = (movieId: number, type: string) => {
    router.push(`/${type}/${movieId}`);
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
            className="flex-grow p-3 h-14 rounded-l-lg bg-gray-800 text-white focus:outline-none inner-focus-ring"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-500 p-3 h-14 w-14 rounded-r-lg hover:bg-yellow-600 flex items-center justify-center"
          >
            <FaSearch className="text-black" />
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {results.length > 0
            ? results.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() =>
                    handleSlideClick(
                      item.id,
                      item.first_air_date ? "tv_series_detail" : "movie_detail"
                    )
                  }
                >
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"
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
              ))
            : !loading && searchPerformed && (
                <p className="col-span-full text-center">No results found.</p>
              )}
        </div>

        {/* Only show pagination if there are results */}
        {results.length > 0 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Previous
            </button>
            <span className="text-lg">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
