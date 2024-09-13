import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaArrowLeft, FaTrash } from "react-icons/fa"; // Import de l'icône de suppression
import AddToCartButton from "../components/AddToCartButton";
import AddToWishlistButton from "../components/AddToWishlistButton";
import FadeInSection from "./FadeInSection";
import type { Star } from "../types";

interface StarCardProps {
  star: Star;
  context?: 'catalog' | 'cart' | 'wishlist';
  quantity?: number;
  onRemove?: (starId: number) => void;
  isDetailedView?: boolean;
  showAddToCartButton?: boolean; // Ajoutez cette ligne
}

const StarCard: React.FC<StarCardProps> = ({
  star,
  context = 'catalog',
  quantity,
  onRemove,
  isDetailedView = false,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Retour à la page précédente
  };

  const handleRemoveClick = () => {
    if (onRemove) {
      onRemove(star.starid);
    }
  };

  return (
    <FadeInSection>
      <div
        className={`bg-secondary text-text rounded-lg shadow-lg flex ${
          isDetailedView ? "md:flex-row" : "flex-col"
        } h-full mb-4`}
      >
        <img
          src={`/assets/images/stars/${star.name.toLowerCase().replace(/\s+/g, "")}.jpg`}
          alt={star.name}
          className={`w-full ${isDetailedView ? "md:w-1/2" : "h-48"} object-cover`}
        />
        <div className={`p-4 flex-grow ${isDetailedView ? "md:pl-8" : ""}`}>
          <h2 className="text-xl font-serif mb-2">{star.name}</h2>

          {isDetailedView ? (
            <>
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
            </>
          ) : (
            <p className="text-sm mb-4">{star.description}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{star.price} €</span>
            {quantity !== undefined && (
              <span className="text-sm">Quantité : {quantity}</span>
            )}
          </div>

          {/* Barre de boutons */}
          <div className="flex mt-4 space-x-2">
            {isDetailedView ? (
              <button type="button" onClick={handleBackClick} className="btn mt-2">
                <FaArrowLeft className="text-xl" />
                <span className="sr-only">Retour</span>
              </button>
            ) : (
              <Link to={`/star/${star.starid}`} className="btn mt-2">
                <FaEye className="text-xl" />
                <span className="sr-only">Découvrir</span>
              </Link>
            )}

            {context === 'catalog' && (
              <>
                <AddToCartButton starId={star.starid} />
                <AddToWishlistButton starId={star.starid} />
              </>
            )}

            {context === 'cart' && (
              <>
                <button type="button" onClick={handleRemoveClick} className="btn mt-2">
                  <FaTrash className="text-xl" />
                  <span className="sr-only">Retirer du panier</span>
                </button>
              </>
            )}

            {context === 'wishlist' && (
              <>
                <AddToCartButton starId={star.starid} />
                <button type="button" onClick={handleRemoveClick} className="btn mt-2">
                  <FaTrash className="text-xl" />
                  <span className="sr-only">Retirer de la liste d'envies</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default memo(StarCard);
