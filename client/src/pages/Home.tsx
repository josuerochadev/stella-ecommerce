// client/src/pages/Home.tsx

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { useHeroPhrases } from "../hooks/useHeroPhrases";
import StarCard from "../components/StarCard";
import { useLatestStars } from "../hooks/useLatestStars";
import { useFunFacts } from "../hooks/useFunFacts";
import FadeInSection from "../components/FadeInSection";
import { useAuth } from "../context/AuthContext";
import { APP_CONSTANTS } from '../constants/app';


const Home: React.FC = () => {
  const { stars, loading, error } = useLatestStars(APP_CONSTANTS.STARS_PER_PAGE_HOME);
  const currentFact = useFunFacts();
  const { currentPhrase, fade } = useHeroPhrases(APP_CONSTANTS.HERO_PHRASES_INTERVAL);
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-12">
      {" "}
      {/* Ajout d'un espace global entre les sections */}
      <FadeInSection>
        <HeroSection>
          <h1 className="text-5xl md:text-6xl font-display mb-4 text-text h1-neon">Stella</h1>
          <p
            className={`text-lg md:text-2xl font-serif text-text transition-opacity duration-800 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {currentPhrase}
          </p>
          <a href="/catalog" className="btn mt-4">
            Voir notre catalogue
          </a>
        </HeroSection>
      </FadeInSection>
      {/* Section Qui sommes-nous ? */}
      <FadeInSection>
        <section className="mx-auto text-text py-8 text-center">
          <h2 className="text-3xl font-display mb-8">Qui sommes-nous ?</h2>
          <div className="flex flex-col md:flex-row items-center px-8">
            {" "}
            {/* Uniformisation des padding */}
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <img
                src="/assets/images/astro.png"
                alt="Astronaute"
                className="w-2/3 md:w-full object-contain md:h-[300px]"
              />
            </div>
            <div className="md:w-2/3 md:pl-8 text-center md:text-left">
              {" "}
              {/* Alignement du contenu */}
              <p className="text-lg font-serif text-text">
                Chez Stella, nous sommes passionnés par les étoiles et leur capacité à inspirer des
                générations. Nous vous proposons une expérience unique : adopter une étoile et la
                personnaliser pour en faire un cadeau inoubliable. Notre mission est d'illuminer la
                vie de nos clients en leur offrant un morceau du ciel.
              </p>
              <button type="button" className="btn mt-4">
                <a href="/about">Voir plus</a>
              </button>
            </div>
          </div>
        </section>
      </FadeInSection>
      {/* Section Nouveautés */}
      <FadeInSection>
        <section className="mb-12 text-text py-8 text-center">
          <h2 className="text-3xl font-display my-6">Nouveautés</h2>
          {loading && <p className="text-center text-text">Chargement des étoiles...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="relative px-8">
              {" "}
              <div className="flex overflow-y-auto pb-6 space-x-6 scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-gray-400">
                {stars.slice(0, APP_CONSTANTS.MAX_STARS_DISPLAY).map((star) => (
                  <div key={star.starid} className="min-w-[200px] flex justify-evenly">
                    <StarCard star={star} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </FadeInSection>
      {/* Section Le saviez-vous */}
      <FadeInSection>
        <section className="my-12 text-text py-8 text-center">
          {" "}
          <p className="mx-auto font-serif text-2xl text-secondary inline-block max-w-2xl">
            <span className="bg-special px-2 py-1">{currentFact}</span>
          </p>
          <h2 className="text-xl font-display my-6">Le saviez-vous ?</h2>
        </section>
      </FadeInSection>
            {/* Afficher la section "Rejoignez-nous" seulement si l'utilisateur n'est pas connecté */}

      {!isAuthenticated && (
        <FadeInSection>
          <section className="bg-primary my-12 text-text py-8 text-center">
            <h2 className="text-3xl font-display mb-6">Rejoignez-nous</h2>
            <p className="text-lg font-serif mx-auto max-w-2xl mb-6">
              Rejoignez la communauté Stella pour être au courant des dernières nouveautés et
              événements autour des étoiles. Inscrivez-vous à notre newsletter et faites partie de
              notre univers.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/auth")}
            >
              Se connecter
            </button>
          </section>
        </FadeInSection>
      )}
    </div>
  );
};

export default memo(Home);
