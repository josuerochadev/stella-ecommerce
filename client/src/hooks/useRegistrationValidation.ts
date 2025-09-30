// client/src/hooks/useRegistrationValidation.ts
// Responsabilité unique : Validation des données d'inscription avec gestion des erreurs

import { useCallback } from "react";
import { FormValidationService } from "@/services/validationService";
import { useNotificationStore } from "@/stores/useNotificationStore";

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SanitizedRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ValidationResult {
  isValid: boolean;
  sanitizedData?: SanitizedRegistrationData;
}

export const useRegistrationValidation = () => {
  const { showError } = useNotificationStore();

  const validateRegistrationData = useCallback(
    (data: RegistrationData): ValidationResult => {
      // Délégation complète au service de validation
      const validationResult = FormValidationService.validateRegistrationForm(data);

      if (!validationResult.isValid) {
        // Afficher la première erreur trouvée
        const firstError = Object.values(validationResult.errors)[0];
        const firstField = Object.keys(validationResult.errors)[0];

        // Mapping des noms de champs pour l'affichage
        const fieldLabels: Record<string, string> = {
          firstName: "Prénom",
          lastName: "Nom",
          email: "Email",
          password: "Mot de passe"
        };

        showError(
          `${fieldLabels[firstField] || firstField} invalide`,
          firstError
        );

        return { isValid: false };
      }

      return {
        isValid: true,
        sanitizedData: validationResult.sanitizedData,
      };
    },
    [showError]
  );

  return {
    validateRegistrationData,
  };
};