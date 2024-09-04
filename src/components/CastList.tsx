import React, { useRef, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Swiper as SwiperInstance } from "swiper/types"; // Import the correct Swiper type

interface CastMember {
  id: number;
  name: string;
  profile_path: string; // Profile image path
}

interface CastListProps {
  cast: CastMember[];
  skeleton?: boolean;
}

const CastList: React.FC<CastListProps> = memo(({ cast, skeleton }) => {
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

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
    <div className="relative py-5">
      <h2 className="text-2xl font-bold text-white mb-5">Cast</h2>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={20}
        slidesPerView={2}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper as SwiperInstance;
        }}
        onSwiper={(swiper) => handleSlideChange(swiper)} // Trigger visibility check on load
        onSlideChange={handleSlideChange}
        breakpoints={{
          320: { slidesPerView: 5 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 8 },
        }}
        className="cast-swiper"
      >
        {skeleton
          ? new Array(10).fill(0).map((_, index) => (
              <SwiperSlide
                key={index.toString() + "cast-skeleton"}
                className="w-44 pr-4 self-stretch"
              >
                {/* Skeleton placeholder */}
                <div className="bg-gray-700 w-full h-72 rounded animate-pulse"></div>
              </SwiperSlide>
            ))
          : cast.map((member) => (
              <SwiperSlide key={member.id}>
                <div className="bg-black transform transition-transform duration-300 hover:scale-95 overflow-hidden">
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                        : "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg"
                    }
                    alt={member.name}
                    className="w-full object-cover rounded"
                  />
                  <p className="text-center font-semibold text-xs md:text-sm text-white pt-2">
                    {member.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
        <div
          ref={navigationNextRef}
          onClick={() => swiperRef.current?.slideNext()}
          className="z-10 absolute w-20 h-full bg-gradient-to-l from-black to-transparent  [&.active]:flex transition duration-300 hidden active justify-start items-center cursor-pointer top-2/4 right-0 -translate-y-2/4 hover:text-white text-white text-4xl"
        >
          <MdKeyboardArrowRight className="-translate-x-[-126%] md:-translate-x-[-26%] md:hover:scale-150 transition md:text-8xl text:2xl" />
        </div>

        <div
          ref={navigationPrevRef}
          onClick={() => swiperRef.current?.slidePrev()}
          className="z-10 absolute w-20 h-full bg-gradient-to-r from-black to-transparent  [&.active]:flex transition duration-300 hidden active justify-end items-center cursor-pointer top-2/4 left-0 -translate-y-2/4 hover:text-white text-white text-4xl"
        >
          <MdKeyboardArrowLeft className="-translate-x-[126%] md:-translate-x-[26%] md:hover:scale-150 transition md:text-8xl text:2xl" />
        </div>
      </Swiper>
    </div>
  );
});
CastList.displayName = "CastList";
export default CastList;
