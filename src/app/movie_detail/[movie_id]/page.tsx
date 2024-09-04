"use client";

import React, { useEffect, useState } from "react";
import CastList from "@/components/CastList";
import Loader from "@/components/Loader";
import { AiFillStar } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";

export default function Page({ params }: { params: { movie_id: string } }) {
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieResponse, castResponse] = await Promise.all([
          fetch(`/api/movie_details/${params.movie_id}`),
          fetch(`/api/credits/movie/${params.movie_id}`),
        ]);

        if (!movieResponse.ok || !castResponse.ok) {
          throw new Error("Failed to fetch movie details or cast");
        }

        const movieData = await movieResponse.json();
        const castData = await castResponse.json();

        setMovieDetails(movieData);
        setCast(castData.cast);
      } catch (error) {
        console.error("Error fetching movie details or cast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.movie_id]);

  if (loading) return <Loader />;
  if (!movieDetails) return <div>No movie details found.</div>;

  const productionCompanies = movieDetails.production_companies
    .map((company: { name: string }) => company.name)
    .join(", ");

  const genres = movieDetails.genres
    .map((genre: { id: number; name: string }) => genre.name)
    .join(", ");

  return (
    <div className="relative">
      {/* Backdrop Image */}
      <div
        className="absolute inset-0 bg-cover bg-center h-[30vh] md:h-[100vh]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movieDetails.backdrop_path})`,
        }}
      >
        <div className="absolute bottom-0 right-0 left-0 h-1/5 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      </div>

      {/* Low-opacity Background Layer */}
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

      <div className="relative flex flex-col px-4 pt-4 md:px-40 md:flex-row md:pt-0 items-center min-h-[89vh] md:min-h-screen z-20">
        <div className="w-[30vh] md:w-[50%] flex justify-center">
          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}
            className="md:max-w-xs rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full md:w-[60%] mt-5 md:mt-0">
          <h1
            className="text-white text-3xl mb-4 md:text-4xl font-bold"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            {movieDetails.title || movieDetails.original_title}
          </h1>

          <p
            className="text-white text-lg md:text-xl mb-4 flex items-center"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            <span
              className="flex items-center"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
            >
              <AiFillStar className="text-yellow-500 mr-2" />
              {movieDetails.vote_average.toFixed(2)}
            </span>
            &nbsp;
            <span className="ml-4">
              {movieDetails.release_date
                ? movieDetails.release_date.substring(0, 4)
                : ""}
              &nbsp;
            </span>
            <span
              className="ml-4 text-lg md:text-xl text-white line-clamp-1"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
            >
              {genres}
            </span>
          </p>

          <p
            className="text-white text-sm md:text-base"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            {movieDetails.overview}
          </p>

          <br />
          <a
            href={`/play/movie/${movieDetails.imdb_id}`}
            className="bg-yellow-500 text-black font-semibold py-3 px-8 md:px-10 rounded hover:bg-yellow-600 inline-flex items-center shadow-lg"
          >
            <FaPlay className="mr-2" />
            Play
          </a>
        </div>
      </div>

      <div className="relative z-10 pl-4 pr-2 md:px-64">
        <CastList cast={cast} />
      </div>
    </div>
  );
}
