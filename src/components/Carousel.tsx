"use client";

import { useRouter } from "next/navigation";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AiFillStar } from "react-icons/ai"; // Import the star icon

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Carousel = ({ movies_list }: { movies_list: any[] }) => {
  const router = useRouter();

  const handleSlideClick = (movieId: number, type: string) => {
    router.push(`/${type}/${movieId}`);
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      className="md:h-[50vh] h-[30vh] w-[100vw] md:mb-1 mb-0"
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2000, // (3000ms = 3 seconds)
        disableOnInteraction: false, 
      }}
      loop={true}
    >
      {movies_list.map((item: any) => (
        <SwiperSlide
          key={item.id}
          className="relative cursor-pointer"
          onClick={() =>
            handleSlideClick(
              item.id,
              item.number_of_episodes ? "tv_series_detail" : "movie_detail"
            )
          }
        >
          {/* Layout 1 for larger screens */}
          <div className="hidden md:flex flex-row h-full">
            {/* Title section */}
            <div className="relative top-0 left-0 flex-shrink-0 md:w-[60%] w-[30%] p-4 flex items-center justify-start text-white">
              <div className="absolute top-10 left-10 md:p-5">
                <span className="md:text-2xl text-xs font-bold mb-2 line-clamp-3">
                  {item.title}
                </span>
                <div className="flex flex-col md:flex-row md:items-center md:text-xl text-sm font-semibold mb-2">
                  <span className="mr-2 md:text-lg text-xs font-semibold">
                    {item.release_date.substring(0, 4)}
                  </span>
                  <div className="flex flex-row items-center">
                    <AiFillStar className="text-yellow-500 mr-1" />
                    <div className="text-xs md:text-lg">
                      {item.vote_average.toFixed(1)}
                    </div>
                  </div>
                </div>

                <p className="md:block hidden text-sm leading-relaxed mr-40">
                  {item.overview}
                </p>
              </div>
            </div>
            {/* Image section with gradient overlay */}
            <div className="relative w-full h-full">
              <img
                src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
                alt={item.title}
                className="h-full w-full"
              />
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 top-0 w-40 bg-gradient-to-r from-black to-transparent"></div>
            </div>
          </div>

          {/* Layout 2 for smaller screens */}
          <div className="md:hidden relative w-full h-full">
            {/* Image section */}
            <img
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t h-[70%] from-black to-transparent"></div>
            {/* Title and details */}
            <div className="absolute bottom-0 left-0 pl-6 pb-6 w-full flex flex-col text-white">
              <div className="mb-2">
                <span className="text-xl font-bold mb-2 block" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 1)" }}>{item.title}</span>
                <div className="flex items-center text-sm md:text-lg font-semibold">
                  <span className="mr-2" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 1)" }}>{item.release_date.substring(0, 4)}</span>
                  <div className="flex items-center">
                    <AiFillStar className="text-yellow-500 mr-1" />
                    <span style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 1)" }}>{item.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              {/* Overview for larger screens */}
              <p className="md:block hidden text-sm leading-relaxed">{item.overview}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
