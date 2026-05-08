// client/src/pages/Home.tsx

import FadeInSection from "@/components/FadeInSection";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";
import StarCard from "@/components/StarCard";
import { APP_CONSTANTS } from "@/constants/app";
import { useAuth } from "@/context/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useFunFacts } from "@/hooks/useFunFacts";
import { useHeroPhrases } from "@/hooks/useHeroPhrases";
import { useLatestStars } from "@/hooks/useLatestStars";
import { memo } from "react";

const Home: React.FC = () => {
  const { stars, loading, error } = useLatestStars(APP_CONSTANTS.STARS_PER_PAGE_HOME);
  const currentFact = useFunFacts();
  const { currentPhrase, fade } = useHeroPhrases(APP_CONSTANTS.HERO_PHRASES_INTERVAL);
  const { redirectToAuth } = useAuthRedirect();

  const { isAuthenticated } = useAuth();

  return (
    <div>
      <SEO path="/" />
      {/* Hero */}
      <FadeInSection>
        <HeroSection>
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-special/70 mb-5 font-sans">
              STELLA — ADOPT A STAR
            </p>
            <h1 className="text-5xl md:text-[clamp(64px,10vw,120px)] font-display mb-2 text-periwinkle-100 leading-[0.95] tracking-tight h1-neon">
              Stella
            </h1>
            <p
              className={`text-lg md:text-[clamp(17px,2.5vw,22px)] font-serif text-periwinkle-100/65 font-light mt-5 mb-9 max-w-[720px] mx-auto leading-normal transition-opacity duration-500 ease-in-out ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentPhrase}
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/catalog" className="btn text-lg py-2.5 px-6">
                Voir le catalogue
              </a>
              <a
                href="/about"
                className="btn-secondary text-lg py-2.5 px-6 inline-flex items-center"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </HeroSection>
      </FadeInSection>

      {/* Section Qui sommes-nous ? */}
      <FadeInSection>
        <section className="max-w-[1100px] mx-auto text-text py-24 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-special/60 mb-4 font-sans">
                QUI SOMMES-NOUS
              </p>
              <h2 className="text-3xl md:text-[clamp(32px,4vw,52px)] font-display mb-6 text-periwinkle-100 leading-[1.05] tracking-tight">
                Un morceau du ciel, pour vous.
              </h2>
              <p className="text-base font-serif text-text/70 leading-relaxed mb-8 font-light">
                Chez Stella, nous sommes passionnés par les étoiles et leur capacité à inspirer des
                générations. Nous vous proposons une expérience unique : adopter une étoile et la
                personnaliser pour en faire un cadeau inoubliable. Notre mission est
                d&apos;illuminer la vie de nos clients en leur offrant un morceau du ciel.
              </p>
              <a href="/about" className="btn-secondary inline-flex items-center">
                Notre histoire
              </a>
            </div>
            <div className="flex justify-center">
              <picture>
                <source srcSet="/assets/images/astro.webp" type="image/webp" />
                <img
                  src="/assets/images/astro.png"
                  alt="Astronaute"
                  width={380}
                  height={380}
                  loading="lazy"
                  className="w-full max-w-[380px] object-contain drop-shadow-[0_0_40px_rgba(61,42,84,0.8)]"
                />
              </picture>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Section Nouveautés */}
      <FadeInSection>
        <section className="pb-24 text-text">
          <div className="max-w-[1100px] mx-auto px-10">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-special/60 mb-2 font-sans">
                  CATALOGUE
                </p>
                <h2 className="text-3xl md:text-[clamp(28px,3.5vw,42px)] font-display text-periwinkle-100 tracking-tight">
                  Dernières étoiles
                </h2>
              </div>
              <a href="/catalog" className="btn-ghost text-sm flex items-center gap-2">
                Voir tout &rarr;
              </a>
            </div>

            {loading && <p className="text-center text-text/50">Chargement des étoiles...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}

            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stars.slice(0, APP_CONSTANTS.MAX_STARS_DISPLAY).map((star) => (
                  <div key={star.starid}>
                    <StarCard star={star} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </FadeInSection>

      {/* Section Le saviez-vous */}
      <FadeInSection>
        <section className="py-20 text-text border-t border-text/[0.05] border-b border-b-text/[0.05]">
          <div className="max-w-[700px] mx-auto text-center px-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-special/60 mb-5 font-sans">
              LE SAVIEZ-VOUS ?
            </p>
            <blockquote className="font-serif font-light text-xl md:text-[clamp(18px,2.5vw,26px)] text-periwinkle-100/75 leading-relaxed">
              &laquo; {currentFact} &raquo;
            </blockquote>
          </div>
        </section>
      </FadeInSection>

      {/* Afficher la section "Rejoignez-nous" seulement si l'utilisateur n'est pas connecté */}
      {!isAuthenticated && (
        <FadeInSection>
          <section className="py-24 text-text text-center px-10">
            <h2 className="text-3xl md:text-[clamp(32px,5vw,64px)] font-display mb-4 text-periwinkle-100 tracking-tight leading-none">
              Rejoignez-nous
            </h2>
            <p className="text-base font-serif font-light text-text/60 max-w-[480px] mx-auto mb-9 leading-relaxed">
              Rejoignez la communauté Stella et faites partie de notre univers.
            </p>
            <button
              type="button"
              className="btn text-lg py-2.5 px-6"
              onClick={() => redirectToAuth()}
            >
              Créer un compte
            </button>
          </section>
        </FadeInSection>
      )}
    </div>
  );
};

export default memo(Home);
