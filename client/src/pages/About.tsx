// client/src/pages/About.tsx
import type React from "react";
import FadeInSection from "@/components/FadeInSection";

const About: React.FC = () => {
  return (
    <div className="container mx-auto pt-20 px-4">
      <h1 className="text-4xl font-display mb-8 text-center">À propos de Stella</h1>
      <FadeInSection>
        <div className="bg-secondary text-text p-6 rounded-md shadow-lg">
          <p className="text-lg font-serif mb-4">
            Bienvenue chez Stella, votre portail vers les étoiles. Fondée en 2024, notre mission est
            de rapprocher l'univers de chacun d'entre vous.
          </p>
          <p className="text-lg font-serif mb-4">
            Chez Stella, nous croyons que chaque étoile raconte une histoire unique. Notre passion
            est de vous permettre de faire partie de cette histoire cosmique en vous offrant la
            possibilité de posséder votre propre étoile.
          </p>
          <p className="text-lg font-serif mb-4">
            Notre équipe d'astronomes passionnés travaille sans relâche pour cartographier le ciel
            nocturne et identifier les étoiles les plus fascinantes. Chaque étoile de notre
            catalogue est soigneusement sélectionnée pour sa beauté et son caractère unique.
          </p>
          <p className="text-lg font-serif mb-4">
            En choisissant Stella, vous ne faites pas qu'acheter une étoile - vous devenez gardien
            d'un morceau de l'univers, créant un lien éternel entre vous et le cosmos.
          </p>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;
