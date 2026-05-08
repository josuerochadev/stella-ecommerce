// client/src/components/DetailStarCard.tsx
// Responsabilité unique : Affichage détaillé d'une étoile

import type { Star } from "@/types";
import { ArrowLeftIcon } from "@/utils/icons";
import { getStarImagePath, getStarImagePathWebP } from "@/utils/pathHelpers";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import FadeInSection from "./FadeInSection";

interface DetailStarCardProps {
  star: Star;
}

const DetailStarCard: React.FC<DetailStarCardProps> = ({ star }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <FadeInSection>
      <div className="bg-surface-1 text-text rounded-lg shadow-lg flex md:flex-row flex-col h-full mb-4 overflow-hidden border border-text/[0.07]">
        <picture className="md:w-1/2 w-full">
          <source srcSet={getStarImagePathWebP(star)} type="image/webp" />
          <img
            src={getStarImagePath(star)}
            alt={star.name}
            width={600}
            height={600}
            loading="lazy"
            className="w-full h-full object-cover brightness-[0.85] saturate-[0.9]"
          />
        </picture>
        <div className="p-6 flex-grow flex flex-col justify-between md:pl-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-special/70 mb-2">
              {star.constellation}
            </p>
            <h2 className="text-3xl font-display mb-4 text-periwinkle-100">{star.name}</h2>
          </div>

          <p className="text-base font-serif mb-6 text-text/75 leading-relaxed">
            {star.description}
          </p>

          <div className="grid grid-cols-2 gap-[1px] border border-text/[0.07] rounded-md overflow-hidden mb-6">
            {[
              ["Constellation", star.constellation],
              ["Distance", `${star.distanceFromEarth} al`],
              ["Luminosite", `${star.luminosity} L`],
              ["Magnitude", star.magnitude],
              ["Masse", `${star.mass} M`],
              ["Statut", "Disponible"],
            ].map(([label, value]) => (
              <div key={String(label)} className="p-3 bg-surface-0/50 border-b border-text/[0.05]">
                <div className="text-[10px] uppercase tracking-[0.1em] text-text/35 mb-1">
                  {label}
                </div>
                <div className="text-sm font-serif text-text">{value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-action tracking-wide text-special">
              {star.price} &euro;
            </span>
          </div>

          <div className="flex mt-4 gap-2">
            <button type="button" onClick={handleBackClick} className="btn mt-2">
              <ArrowLeftIcon className="text-xl" />
              <span className="sr-only">Retour</span>
            </button>
            <AddToCartButton starId={star.starid} />
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default memo(DetailStarCard);
