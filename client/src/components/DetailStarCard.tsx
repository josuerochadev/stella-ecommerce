// client/src/components/DetailStarCard.tsx
// Responsabilité unique : Affichage détaillé d'une étoile

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "../utils/icons";
import FadeInSection from "./FadeInSection";
import type { Star } from "../types";

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
      <div className="bg-secondary text-text rounded-lg shadow-lg flex md:flex-row flex-col h-full mb-4 overflow-hidden card-hover-effect">
        <img
          src={`/assets/images/stars/${star.name.toLowerCase().replace(/\s+/g, "")}.jpg`}
          alt={star.name}
          className="md:w-1/2 w-full object-cover"
        />
        <div className="p-4 flex-grow flex flex-col justify-between md:pl-8">
          <h2 className="text-xl font-display mb-2">{star.name}</h2>

          <p className="text-lg font-serif mb-6">{star.description}</p>

          <ul className="text-lg font-serif mb-6">
            <li>
              <strong>Constellation :</strong> {star.constellation}
            </li>
            <li>
              <strong>Distance de la Terre :</strong> {star.distanceFromEarth} al
            </li>
            <li>
              <strong>Luminosité :</strong> {star.luminosity} L
            </li>
            <li>
              <strong>Magnitude :</strong> {star.magnitude}
            </li>
            <li>
              <strong>Masse :</strong> {star.mass} M
            </li>
          </ul>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{star.price} €</span>
          </div>

          <div className="flex mt-4">
            <button type="button" onClick={handleBackClick} className="btn mt-2">
              <ArrowLeftIcon className="text-xl" />
              <span className="sr-only">Retour</span>
            </button>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default memo(DetailStarCard);