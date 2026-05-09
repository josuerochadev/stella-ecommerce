// client/src/services/contactService.ts
// Responsabilité unique : Envoi du formulaire de contact

import { httpClient } from "./httpClient";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Envoie un message via le formulaire de contact.
 */
export const sendContactMessage = async (data: ContactFormData): Promise<void> => {
  await httpClient.post("/contact", data);
};
