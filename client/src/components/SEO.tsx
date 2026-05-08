import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  image?: string;
}

const SITE_NAME = "Stella";
const BASE_URL = "https://stella-ecommerce.fr";
const DEFAULT_DESCRIPTION =
  "Adoptez une etoile et offrez un cadeau unique. Explorez notre catalogue d'etoiles personnalisables.";
const DEFAULT_IMAGE = `${BASE_URL}/assets/images/hero/1.jpg`;

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  type = "website",
  image = DEFAULT_IMAGE,
}) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Adoptez une etoile`;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
