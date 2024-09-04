import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FaPlay, FaPlayCircle } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Swiper as SwiperInstance } from "swiper/types";

interface ShowcaseProps {
  heading: string;
  items_list: any[];
}

const Showcase: React.FC<ShowcaseProps> = ({ heading, items_list }) => {
  const router = useRouter();
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const handleSlideClick = (movieId: number, type: string) => {
    router.push(`/${type}/${movieId}`);
  };

  const handleSlideChange = (swiper: SwiperInstance) => {
    if (!navigationNextRef.current || !navigationPrevRef.current) return;

    if (swiper.isBeginning) {
      navigationPrevRef.current.classList.remove("active");
    } else {
      navigationPrevRef.current.classList.add("active");
    }

    if (swiper.isEnd) {
      navigationNextRef.current.classList.remove("active");
    } else {
      navigationNextRef.current.classList.add("active");
    }
  };

  return (
    <div className="md:pl-8 w-[100vw] md:pr-8 md:pb-5 md:pt-1 pb-0 pt-5  relative">
      <h1 className="text-md md:text-xl font-bold pb-4 pl-1 md:pl-0">
        {heading}
      </h1>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        breakpoints={{
          320: {
            slidesPerView: 3,
            spaceBetween: 1,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper as SwiperInstance;
        }}
        onSwiper={(swiper) => handleSlideChange(swiper)}
        onSlideChange={handleSlideChange}
        className="showcase-swiper"
      >
        {items_list.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative px-1 md:px-0 sm:hover:scale-95 sm:hover:z-10 sm:transition-transform sm:duration-300 group"
            onClick={() =>
              handleSlideClick(
                item.id,
                item.first_air_date ? "tv_series_detail" : "movie_detail"
              )
            }
          >
            <div className="relative bg-black sm:bg-transparent transform sm:duration-300 sm:hover:z-10 overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/${
                  window.innerWidth < 640 ? "w300" : "w500"
                }${
                  window.innerWidth < 640
                    ? item.poster_path
                    : item.backdrop_path
                }`}
                alt={item.title}
                className="w-full h-full object-cover rounded sm:rounded-none transition-all group-hover:scale-95"
              />

              <div className="hidden md:block absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent "></div>

              {/* Play Button - Shown on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 ">
                <button
                  className="bg-white text-black p-5 rounded-full"
                  aria-label="Play"
                >
                  <FaPlay />
                </button>
              </div>
            </div>

            <div className="bottom-0 left-0 right-0 pl-4 md:pl-8 pb-0 pt-1 text-white z-10 line-clamp-1">
              <h2 className="text-xs md:text-lg font-semibold hidden md:block">
                {item?.title || item?.original_name}
              </h2>
            </div>
          </SwiperSlide>
        ))}

        <div
          ref={navigationNextRef}
          onClick={() => swiperRef.current?.slideNext()}
          className="z-10 absolute w-16 h-full bg-gradient-to-l from-black to-transparent [&.active]:flex transition duration-300 hidden active justify-start items-center cursor-pointer top-0 bottom-0 md:top-[40%] right-0 md:-translate-y-2/4 hover:text-white text-white text-4xl"
        >
          <MdKeyboardArrowRight className="translate-x-[40%] md:translate-x-[26%] md:hover:scale-150 transition md:text-8xl text-6xl" />
        </div>

        <div
          ref={navigationPrevRef}
          onClick={() => swiperRef.current?.slidePrev()}
          className="z-10 absolute w-16 h-full bg-gradient-to-r from-black to-transparent [&.active]:flex transition duration-300 hidden active justify-end items-center cursor-pointer top-0 bottom-0 md:top-[40%] left-0  md:-translate-y-2/4 hover:text-white text-white text-4xl"
        >
          <MdKeyboardArrowLeft className="-translate-x-[40%] md:-translate-x-[26%] md:hover:scale-150 transition md:text-8xl text-6xl" />
        </div>
      </Swiper>
    </div>
  );
};

export default Showcase;
