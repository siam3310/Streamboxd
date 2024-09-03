"use client";

import React, { useEffect, useState } from "react";
import Carousel from "@/components/Carousel";
import Showcase from "@/components/Showcase";
import { prominent } from "color.js";
import Loader from "@/components/Loader";

const Page = () => {
  const [moviesCarousel, setMoviesCarousel] = useState([]);
  const [moviesNowPlaying, setMoviesNowPlaying] = useState([]);
  const [tvNowPlaying, setTvNowPlaying] = useState([]);
  const [tvTopRated, setTvTopRated] = useState([]);
  const [movieTopRated, setMovieTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchColorForMovies = async (movies: any) => {
    const moviesWithColor = await Promise.all(
      movies.map(async (movie: any) => {
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
        try {
          const color = await prominent(imageUrl, { amount: 1 });
          return {
            ...movie,
            color: `rgba(${color[0]}, ${color[1]}, ${color[2]},1)`,
          };
        } catch (error) {
          console.error(`Error fetching color for ${movie.title}:`, error);
          return { ...movie, color: "#FFFFFF" }; // Default color in case of error
        }
      })
    );

    return moviesWithColor;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [
          moviesCarouselRes,
          moviesNowPlayingRes,
          tvNowPlayingRes,
          tvTopRatedRes,
          movieTopRatedRes,
        ] = await Promise.all([
          fetch("/api/trending_movies"),
          fetch("/api/now_playing/movie"),
          fetch("/api/now_playing/tv"),
          fetch("/api/top_rated/tv"),
          fetch("/api/top_rated/movie"),
        ]);

        if (
          !moviesCarouselRes.ok ||
          !moviesNowPlayingRes.ok ||
          !tvNowPlayingRes.ok ||
          !tvTopRatedRes.ok ||
          !movieTopRatedRes.ok
        ) {
          throw new Error("Failed to fetch some data");
        }

        const [
          moviesCarouselData,
          moviesNowPlayingData,
          tvNowPlayingData,
          tvTopRatedData,
          movieTopRatedData,
        ] = await Promise.all([
          moviesCarouselRes.json(),
          moviesNowPlayingRes.json(),
          tvNowPlayingRes.json(),
          tvTopRatedRes.json(),
          movieTopRatedRes.json(),
        ]);

        // Clip the number of trending movies to 5 and fetch colors for carousel movies
        const moviesCarouselWithColors: any = await fetchColorForMovies(
          moviesCarouselData.results.slice(0, 5)
        );

        setMoviesCarousel(moviesCarouselWithColors);
        setMoviesNowPlaying(moviesNowPlayingData.results);
        setTvNowPlaying(tvNowPlayingData.results);
        setTvTopRated(tvTopRatedData.results);
        setMovieTopRated(movieTopRatedData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="overflow-hidden">
      <Carousel movies_list={moviesCarousel} />
      {moviesNowPlaying.length > 0 && (
        <Showcase heading={"Latest Movies"} items_list={moviesNowPlaying} />
      )}
      {tvNowPlaying.length > 0 && (
        <Showcase heading={"Latest TV Series"} items_list={tvNowPlaying} />
      )}
      {movieTopRated.length > 0 && (
        <Showcase heading={"Top Rated Movies"} items_list={movieTopRated} />
      )}
      {tvTopRated.length > 0 && (
        <Showcase heading={"Top Rated TV Series"} items_list={tvTopRated} />
      )}
    </div>
  );
};

export default Page;
