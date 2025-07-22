import React from "react";
import HomeCarousel from "../components/HomeCarousel";

import HPCL from "../assets/images/HPCL.png";
import Indane from "../assets/images/Indane.png";
import CPL from "../assets/images/CPL.png";
import BharatGas from "../assets/images/BharatGas.jpeg";
import Total from "../assets/images/Total.png";
import SHV from "../assets/images/SHV.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const images = [
    { id: 1, src: HPCL, alt: "Image 1", title: "HPCL" },
    { id: 2, src: BharatGas, alt: "Image 2", title: "BPCL" },
    { id: 3, src: Indane, alt: "Image 2", title: "IOCL" },
    { id: 4, src: SHV, alt: "Image 2", title: "HSV" },
    { id: 5, src: Total, alt: "Image 2", title: "Total" },
    { id: 6, src: CPL, alt: "Image 2", title: "CPL" },
  ];

  const handleClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="flex flex-col w-full">
      <HomeCarousel />

      <div className="flex flex-col max-w-[95%] sm:max-w-[90%] mx-auto w-full mt-4 mb-10 gap-3 sm:gap-4">
        <p className="text-lg sm:text-xl font-medium">Shop by Brand</p>

        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            lg:grid-cols-3 
            gap-3 
            sm:gap-4 
            justify-evenly 
            items-center
          "
        >
          {images.map((image) => (
            <div
              onClick={() => handleClick(image.title)}
              key={image.id}
              className="flex flex-col h-36 w-28 sm:h-40 sm:w-32 lg:h-50 lg:w-36 mx-auto cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-contain"
              />
              <p className="text-center mt-2 text-sm sm:text-base">
                {image.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
