"use client";

import { useRouter } from "next/navigation";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
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
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      className="md:h-[50vh] h-[30vh] w-[100vw]"
      slidesPerView={1}
      pagination={{ clickable: true }}
    >
      {movies_list.map((item: any) => (
        <SwiperSlide
          key={item.id}
          className="cursor-pointer relative"
          onClick={() =>
            handleSlideClick(
              item.id,
              item.number_of_episodes ? "tv_series_detail" : "movie_detail"
            )
          }
        >
          <div className="relative w-full h-full">
            {/* Image section */}
            <img
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            {/* Title and details */}
            <div className="absolute bottom-0 left-0 p-4 md:w-[60%] w-full flex flex-col text-white">
              <div className="mb-2">
                <span className="text-xl font-bold mb-2 block">{item.title}</span>
                <div className="flex items-center text-sm md:text-lg font-semibold">
                  <span className="mr-2">{item.release_date.substring(0, 4)}</span>
                  <div className="flex items-center">
                    <AiFillStar className="text-yellow-500 mr-1" />
                    <span>{item.vote_average.toFixed(1)}</span>
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
