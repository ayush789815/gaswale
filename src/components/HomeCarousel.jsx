import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";

import CaroImg01 from "../assets/images/GW-Carousel-1st.jpeg";
import CaroImg02 from "../assets/images/GW-Carousel-2nd.png";
import CaroImg03 from "../assets/images/GW-Carousel-3rd.jpeg";
import CaroImg04 from "../assets/images/GW-Carousel-4th.jpeg";

export default function HomeCarousel() {
  return (
    <div className="w-[90%] mx-auto mt-5">
      <Swiper
        navigation={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper h-[33vh] "
      >
        <SwiperSlide>
          <div className="flex bg-red-500 h-full w-full">
            <div className="flex flex-1/2 bg-green-500 h-full w-full">
              <img
                src={CaroImg01}
                alt="Gaswale Carousel Image 1"
                className="w-full h-full object-fill"
              />
            </div>
            <div className="flex flex-1/2 bg-yellow-500 h-full w-full">
              <img
                src={CaroImg02}
                alt="Gaswale Carousel Image 2"
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex bg-red-500 h-full w-full">
            <div className="flex flex-1/2 bg-green-500 h-full w-full">
              <img
                src={CaroImg02}
                alt="Gaswale Carousel Image 1"
                className="w-full h-full object-fill"
              />
            </div>
            <div className="flex flex-1/2 bg-yellow-500 h-full w-full">
              <img
                src={CaroImg03}
                alt="Gaswale Carousel Image 2"
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex bg-red-500 h-full w-full">
            <div className="flex flex-1/2 bg-green-500 h-full w-full">
              <img
                src={CaroImg03}
                alt="Gaswale Carousel Image 1"
                className="w-full h-full object-fill"
              />
            </div>
            <div className="flex flex-1/2 bg-yellow-500 h-full w-full">
              <img
                src={CaroImg04}
                alt="Gaswale Carousel Image 2"
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex bg-red-500 h-full w-full">
            <div className="flex flex-1/2 bg-green-500 h-full w-full">
              <img
                src={CaroImg04}
                alt="Gaswale Carousel Image 1"
                className="w-full h-full object-fill"
              />
            </div>
            <div className="flex flex-1/2 bg-yellow-500 h-full w-full">
              <img
                src={CaroImg01}
                alt="Gaswale Carousel Image 2"
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
