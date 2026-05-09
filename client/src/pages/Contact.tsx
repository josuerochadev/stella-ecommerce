import FadeInSection from "@/components/FadeInSection";
import SEO from "@/components/SEO";
import { sendContactMessage } from "@/services/contactService";
import { useState } from "react";
import type React from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendContactMessage(formData);
      setSubmitted(true);
    } catch {
      setError(
        "L'envoi du message a échoué. Veuillez réessayer ou nous contacter directement par email.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-20 px-4 max-w-xl">
      <SEO
        title="Contact"
        description="Contactez l'equipe Stella. Questions, support ou informations sur nos etoiles."
        path="/contact"
      />
      <h1 className="text-4xl font-display mb-6 text-center">Contactez-nous</h1>
      <FadeInSection>
        <div className="bg-secondary text-text p-6 rounded-md shadow-lg mb-8">
          <p className="text-lg font-serif mb-4">
            Vous avez des questions sur nos services ou besoin d'informations supplémentaires ?
            N'hésitez pas à nous contacter. Notre équipe est là pour vous répondre.
          </p>
          {submitted ? (
            <div className="text-center py-8" role="status" aria-live="polite">
              <p className="text-2xl mb-2" aria-hidden="true">
                ✓
              </p>
              <p className="text-lg font-serif">
                Merci pour votre message ! Nous vous repondrons dans les plus brefs delais.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-3 bg-red-900/80 border border-red-500 text-red-100 rounded-md text-sm"
                >
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nom{" "}
                  <span aria-hidden="true" className="text-special">
                    *
                  </span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email{" "}
                  <span aria-hidden="true" className="text-special">
                    *
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Votre email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Sujet{" "}
                  <span aria-hidden="true" className="text-special">
                    *
                  </span>
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Sujet de votre message"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message{" "}
                  <span aria-hidden="true" className="text-special">
                    *
                  </span>
                </label>
                <textarea
                  id="message"
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={5}
                />
              </div>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : "Envoyer"}
              </button>
            </form>
          )}
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="bg-secondary text-text p-6 rounded-md shadow-lg">
          <h3 className="text-2xl font-display mb-4">Autres moyens de nous contacter</h3>
          <p className="text-lg font-serif">Email : contact@stella.com</p>
          <p className="text-lg font-serif">Téléphone : +33 1 23 45 67 89</p>
          <p className="text-lg font-serif">Adresse : 123 Rue des Étoiles, 75000 Paris, France</p>
        </div>
      </FadeInSection>
    </div>
  );
};

export default Contact;
