import FadeInSection from "@/components/FadeInSection";
import SEO from "@/components/SEO";
import { useState } from "react";
import type React from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <div className="text-center py-8">
              <p className="text-lg font-serif">
                Merci pour votre message ! Nous vous repondrons dans les plus brefs delais.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Votre email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Sujet
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Sujet de votre message"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-md bg-primary text-text placeholder-text"
                  rows={5}
                />
              </div>
              <button type="submit" className="btn">
                Envoyer
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
