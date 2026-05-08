import FadeInSection from "@/components/FadeInSection";
import ReviewSection from "@/components/ReviewSection";
import SEO from "@/components/SEO";
import StarCard from "@/components/StarCard";
import { useStarDetail } from "@/hooks/useStarDetail";
import type { Star } from "@/types";
import { getStarImagePath } from "@/utils/pathHelpers";
// client/src/pages/ProductDetail.tsx
import { memo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const ProductDetail: React.FC = () => {
  const { starid } = useParams<{ starid: string }>(); // starid est de type 'string | undefined'
  const starIdNumber = starid ? Number.parseInt(starid, 10) : undefined;

  const { star, relatedStars, loading, error } = useStarDetail(starIdNumber);
  if (loading) {
    return <p className="text-center text-text">Chargement des détails de l'étoile...</p>;
  }

  if (error || !star) {
    return (
      <p className="text-center text-red-600">Erreur lors du chargement des détails de l'étoile.</p>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: star.name,
    description: star.description,
    image: `https://stella-ecommerce.fr${getStarImagePath(star)}`,
    offers: {
      "@type": "Offer",
      price: star.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="container mx-auto pt-20 px-4">
      <SEO
        title={star.name}
        description={star.description}
        path={`/star/${star.starid}`}
        type="product"
        image={`https://stella-ecommerce.fr${getStarImagePath(star)}`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <FadeInSection>
        {/* Version détaillée avec bouton */}
        <StarCard star={star} showAddToCartButton={true} isDetailedView={true} />{" "}
        <ReviewSection starId={star.starid} />
        <section className="mt-12">
          <h2 className="text-3xl font-display mb-6 text-text">Vous pouvez aimer aussi :</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedStars.map((relatedStar: Star) => (
              <StarCard
                key={relatedStar.starid}
                star={relatedStar}
                showAddToCartButton={true}
              /> /* Version standard */
            ))}
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default memo(ProductDetail);
