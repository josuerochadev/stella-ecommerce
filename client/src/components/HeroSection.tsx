import type { ReactNode } from "react";
import Slider from "react-slick";

interface HeroSectionProps {
  children?: ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <section className="w-full h-screen overflow-hidden relative">
      <Slider {...settings}>
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <img
            src="/assets/images/hero/1.jpg"
            alt="Constellations"
            width={1920}
            height={1080}
            fetchPriority="high"
            className="w-full h-full object-cover hero-img-animate brightness-[0.28] saturate-[0.7]"
          />
        </div>
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <img
            src="/assets/images/hero/2.jpg"
            alt="Etoiles eclatantes"
            width={1920}
            height={1080}
            loading="lazy"
            className="w-full h-full object-cover hero-img-animate brightness-[0.28] saturate-[0.7]"
          />
        </div>
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <img
            src="/assets/images/hero/3.jpg"
            alt="Adopter une etoile"
            width={1920}
            height={1080}
            loading="lazy"
            className="w-full h-full object-cover hero-img-animate brightness-[0.28] saturate-[0.7]"
          />
        </div>
      </Slider>

      {/* Gradient vignette top + bottom */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #080610 0%, transparent 35%, transparent 65%, #080610 100%)",
        }}
      />

      {children && (
        <div className="absolute inset-0 z-[2] flex flex-col justify-center items-center text-center px-6 transition-opacity duration-500">
          {children}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
