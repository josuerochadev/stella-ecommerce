import FadeInSection from "@/components/FadeInSection";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";

const faqItems = [
  {
    key: "buy-star",
    title: "Comment puis-je acheter une étoile ?",
    content:
      "Pour acheter une étoile, naviguez simplement dans notre catalogue, choisissez l'étoile qui vous plaît, et suivez le processus d'achat. Vous recevrez un certificat de propriété et les coordonnées de votre étoile.",
  },
  {
    key: "star-visible",
    title: "Mon étoile sera-t-elle visible depuis la Terre ?",
    content:
      "La plupart de nos étoiles sont visibles à l'œil nu depuis la Terre. Cependant, la visibilité peut dépendre de facteurs tels que la pollution lumineuse de votre région et les conditions météorologiques.",
  },
  {
    key: "name-star",
    title: "Puis-je nommer mon étoile ?",
    content:
      "Oui, vous pouvez donner un nom symbolique à votre étoile. Ce nom sera enregistré dans notre base de données et figurera sur votre certificat de propriété.",
  },
  {
    key: "gift-star",
    title: "Puis-je offrir une étoile en cadeau ?",
    content:
      "Absolument ! Offrir une étoile est un cadeau unique et mémorable. Lors de votre achat, vous pouvez spécifier qu'il s'agit d'un cadeau et nous préparerons un package cadeau spécial.",
  },
  {
    key: "star-ownership",
    title: 'Que signifie réellement "posséder" une étoile ?',
    content:
      "La \"propriété\" d'une étoile est symbolique. Vous recevez un certificat et le droit de nommer l'étoile dans notre registre. C'est un geste romantique et amusant, mais il n'a pas de valeur légale ou scientifique officielle.",
  },
];

const FAQ: React.FC = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content,
      },
    })),
  };

  return (
    <div className="container mx-auto pt-20 px-4">
      <SEO
        title="Foire aux questions"
        description="Trouvez les reponses a vos questions sur l'achat d'etoiles, la propriete symbolique et les cadeaux sur Stella."
        path="/faq"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <h1 className="text-4xl font-display mb-6 text-center">Foire aux questions</h1>
      <FadeInSection>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.key} className="border-b border-secondary group">
              <summary className="flex items-center justify-between w-full py-4 px-2 font-serif text-lg text-text cursor-pointer list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                {item.title}
                <span
                  className="ml-4 text-text/50 motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-180"
                  aria-hidden="true"
                >
                  ▾
                </span>
              </summary>
              <div className="px-4 pb-4 text-text">
                <p>{item.content}</p>
              </div>
            </details>
          ))}
        </div>
      </FadeInSection>
    </div>
  );
};

export default FAQ;
