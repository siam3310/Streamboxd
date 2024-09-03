'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
  const [genreList, setGenreList] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [movies, setMovies] = useState<any[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const handleSlideClick = (movieId: number) => {
    router.push(`/movie_detail/${movieId}`);
  };

  useEffect(() => {
    const fetchMovieGenre = async () => {
      try {
        const response = await fetch(`/api/movie_genre_list`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie genres');
        }

        const data = await response.json();
        setGenreList(data.genres);
      } catch (error) {
        console.error('Error fetching movie genres:', error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchMovieGenre();
  }, []);

  const handleGenreChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = event.target.value;
    setSelectedGenre(genreId);

    if (genreId) {
      setLoadingMovies(true);
      try {
        const response = await fetch(`/api/movie_genre/${genreId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movies for the selected genre');
        }

        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoadingMovies(false);
      }
    }
  };

  if (loadingGenres) return <div>Loading genres...</div>;

  return (
    <div>
      <h1>Select Movie Genre</h1>
      <select 
        className="p-2 border border-gray-300 rounded" 
        value={selectedGenre} 
        onChange={handleGenreChange}
      >
        <option value="">Select a genre</option>
        {genreList.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {loadingMovies && <div>Loading movies...</div>}

      {!loadingMovies && movies.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Movies in this Genre</h2>
          <ul>
            {movies.map((movie) => (
              <li key={movie.id} className="mt-2" 
              onClick={() => handleSlideClick(movie.id)}
              >
            <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}/>{movie.title} ({movie.release_date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loadingMovies && selectedGenre && movies.length === 0 && (
        <div>No movies found for this genre.</div>
      )}
    </div>
  );
};

export default Page;
