"use client";

import React, { useEffect, useState, useRef } from "react";
import CastList from "@/components/CastList";
import Loader from "@/components/Loader";
import { AiFillStar } from "react-icons/ai";
import { FaCaretDown, FaCaretUp, FaCheck, FaPlay } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";

export default function Page({ params }: { params: { tv_id: string } }) {
  const [tvDetails, setTvDetails] = useState<any>(null);
  const [externalIds, setExternalIds] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false); 
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [episodes, setEpisodes] = useState<any[]>([]);

  const episodeListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTvDetails = async () => {
      try {
        const [
          tvResponse,
          externalIdsResponse,
          castResponse,
          episodesResponse,
        ] = await Promise.all([
          fetch(`/api/tv_details/${params.tv_id}`),
          fetch(`/api/external_ids/${params.tv_id}`),
          fetch(`/api/credits/tv/${params.tv_id}`),
          fetch(`/api/episode_details/${params.tv_id}/${selectedSeason}`),
        ]);

        if (
          !tvResponse.ok ||
          !externalIdsResponse.ok ||
          !castResponse.ok ||
          !episodesResponse.ok
        ) {
          throw new Error("Failed to fetch TV details, external IDs, or cast");
        }

        const tvData = await tvResponse.json();
        const externalIdsData = await externalIdsResponse.json();
        const castData = await castResponse.json();
        const episodesData = await episodesResponse.json();

        setTvDetails(tvData);
        setExternalIds(externalIdsData);
        setCast(castData.cast);
        setEpisodes(episodesData.episodes);
      } catch (error) {
        console.error(
          "Error fetching TV details, external IDs, or cast:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTvDetails();
  }, [params.tv_id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoadingEpisodes(true); 
      try {
        const response = await fetch(
          `/api/episode_details/${params.tv_id}/${selectedSeason}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch episodes");
        }
        const data = await response.json();
        setEpisodes(data.episodes);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoadingEpisodes(false); 
      }
    };

    fetchEpisodes();
  }, [selectedSeason]);

  const handleSeasonSelect = (season: number) => {
    setSelectedSeason(season);
    setShowDropdown(false);

    if (episodeListRef.current) {
      episodeListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    window.location.href = `/tvPlay/tv/${externalIds.imdb_id}/${selectedSeason}/${episodeNumber}`;
  };

  if (loading) return <Loader />;
  if (!tvDetails) return <div>No TV details found.</div>;

  const productionCompanies = tvDetails.production_companies
    .map((company: { name: string }) => company.name)
    .join(", ");

  const genres = tvDetails.genres
    .map((genre: { id: number; name: string }) => genre.name)
    .join(", ");

  return (
    <div className="relative">
      {/* Backdrop Image */}
      <div
        className="absolute inset-0 bg-cover bg-center h-[30vh] md:h-[100vh]"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tvDetails.backdrop_path})`,
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
            src={`https://image.tmdb.org/t/p/w1280${tvDetails.poster_path}`}
            alt={tvDetails.title}
            className="md:max-w-xs rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full md:w-[60%] mt-5 md:mt-0">
          <h1
            className="text-white text-3xl mb-4 md:text-4xl font-bold"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            {tvDetails.title || tvDetails.original_name}
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
              {tvDetails.vote_average.toFixed(2)}
            </span>
            &nbsp;
            <span className="ml-4">
              {tvDetails.last_air_date
                ? tvDetails.last_air_date.substring(0, 4)
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
            className="text-white text-xs md:text-base"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
          >
            {tvDetails.overview}
          </p>

          <br />
          <div className="flex flex-row md:justify-start gap-5">
            {/* Play Button */}
            <a
              href={`/tvPlay/tv/${externalIds.imdb_id}/${selectedSeason}/1`}
              className="bg-yellow-500 text-black font-semibold py-3 px-8 md:px-10 rounded hover:bg-yellow-600 inline-flex items-center shadow-lg"
            >
              <FaPlay className="mr-2" />
              Play now
            </a>

            {/* Season Selection */}

            <Dropdown onClick={() => setShowDropdown(!showDropdown)}>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 md:px-10 py-3 rounded inline-flex items-center shadow-lg justify-between transition-transform duration-300"
              >
                Season {selectedSeason}
                {showDropdown ? (
                  <FaCaretUp size={20} className="ml-3" />
                ) : (
                  <FaCaretDown size={20} className="ml-3" />
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className={`font-semibold rounded bg-yellow-500 ${
                  showDropdown
                    ? "max-h-60 opacity-100 overflow-y-auto"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
                style={{ zIndex: 30, position: "absolute" }}
              >
                {Array.from({ length: tvDetails.number_of_seasons }).map(
                  (_, i) => (
                    <Dropdown.Item
                      key={i + 1}
                      onClick={() => handleSeasonSelect(i + 1)}
                      className="text-black hover:bg-yellow-600 hover:rounded flex items-center"
                    >
                      {i + 1 === selectedSeason && (
                        <FaCheck size={10} className="mr-2" />
                      )}
                      Season {i + 1}
                    </Dropdown.Item>
                  )
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="relative z-20 px-4 md:px-64" ref={episodeListRef}>
  {/* Episode List */}
  {loadingEpisodes ? (
    <Loader /> // Show loader while episodes are being fetched
  ) : (
    <div className="max-h-[560px] md:max-h-[630px] pt-4 overflow-y-auto w-full">
      <h1 className="text-2xl font-bold text-white mb-4 mt-0">
        Season {selectedSeason} episodes
      </h1>
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className="bg-black text-white pt-4 pb-4 pr-4 rounded cursor-pointer transform hover:scale-95 transition-transform duration-200"
          onClick={() => handleEpisodeClick(episode.episode_number)}
        >
          <div className="flex flex-row gap-4 items-center md:flex-row md:space-y-0 md:space-x-4">
            <img
              src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
              className="h-[8vh] md:h-[12vh] rounded"
              alt={`Episode ${episode.episode_number} image`}
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base">
                S{selectedSeason} E{episode.episode_number} - {episode.name}
              </h3>
              <p className="text-xs md:text-sm text-white opacity-50 line-clamp-2">
                {episode.overview}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
  <CastList cast={cast} />
</div>

    </div>
  );
}

       
