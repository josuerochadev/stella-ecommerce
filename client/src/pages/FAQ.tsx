import { useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-display mb-6 text-center">Foire Aux Questions</h1>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={item.key} className="border-b border-gray-600">
            <button
              type="button"
              onClick={() => handleToggle(index)}
              className="w-full text-left py-4 px-2 font-serif text-lg text-primary focus:outline-none"
            >
              {item.title}
            </button>
            {activeIndex === index && (
              <div className="px-4 pb-4 text-text">
                <p>{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
