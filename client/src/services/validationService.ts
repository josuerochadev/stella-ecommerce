// client/src/services/validationService.ts
// Responsabilité unique : Services de validation centralisés et réutilisables

import { validateEmail, validateUsername, validatePassword, sanitizeText } from "../utils/security";

/**
 * Interface pour les résultats de validation
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

/**
 * Interface pour les résultats de validation d'objet
 */
interface ObjectValidationResult<T> {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: T;
}

/**
 * Service de validation pour les champs individuels
 * Responsabilité : Validation et sanitisation de champs uniques
 */
export class FieldValidationService {
  /**
   * Valider et sanitiser un nom d'utilisateur
   */
  static validateUsernameField(username: string): ValidationResult {
    const sanitized = sanitizeText(username).trim();

    if (!sanitized) {
      return {
        isValid: false,
        errors: ["Le nom d'utilisateur est requis."]
      };
    }

    if (!validateUsername(sanitized)) {
      return {
        isValid: false,
        errors: ["Le nom d'utilisateur doit contenir 3-30 caractères alphanumériques, tirets ou underscores."]
      };
    }

    return {
      isValid: true,
      errors: [],
      sanitizedValue: sanitized
    };
  }

  /**
   * Valider et sanitiser un email
   */
  static validateEmailField(email: string): ValidationResult {
    const sanitized = sanitizeText(email).trim();

    if (!sanitized) {
      return {
        isValid: false,
        errors: ["L'email est requis."]
      };
    }

    if (!validateEmail(sanitized)) {
      return {
        isValid: false,
        errors: ["Veuillez entrer une adresse email valide."]
      };
    }

    return {
      isValid: true,
      errors: [],
      sanitizedValue: sanitized
    };
  }

  /**
   * Valider un mot de passe
   */
  static validatePasswordField(password: string): ValidationResult {
    const trimmed = password.trim();

    if (!trimmed) {
      return {
        isValid: false,
        errors: ["Le mot de passe est requis."]
      };
    }

    const passwordValidation = validatePassword(trimmed);

    return {
      isValid: passwordValidation.isValid,
      errors: passwordValidation.isValid ? [] : passwordValidation.errors,
      sanitizedValue: passwordValidation.isValid ? trimmed : undefined
    };
  }

  /**
   * Valider et sanitiser un nom (prénom/nom de famille)
   */
  static validateNameField(name: string, fieldName: string = "nom"): ValidationResult {
    const sanitized = sanitizeText(name).trim();

    if (!sanitized) {
      return {
        isValid: false,
        errors: [`Le ${fieldName} est requis.`]
      };
    }

    if (sanitized.length < 2) {
      return {
        isValid: false,
        errors: [`Le ${fieldName} doit contenir au moins 2 caractères.`]
      };
    }

    if (sanitized.length > 50) {
      return {
        isValid: false,
        errors: [`Le ${fieldName} ne peut pas dépasser 50 caractères.`]
      };
    }

    return {
      isValid: true,
      errors: [],
      sanitizedValue: sanitized
    };
  }
}

/**
 * Service de validation pour les formulaires complets
 * Responsabilité : Validation d'objets complexes
 */
export class FormValidationService {
  /**
   * Valider un formulaire d'inscription complet
   */
  static validateRegistrationForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): ObjectValidationResult<typeof data> {
    const errors: Record<string, string> = {};
    const sanitizedData: any = {};

    // Validation du prénom
    const firstNameResult = FieldValidationService.validateNameField(data.firstName, "prénom");
    if (!firstNameResult.isValid) {
      errors.firstName = firstNameResult.errors[0];
    } else {
      sanitizedData.firstName = firstNameResult.sanitizedValue;
    }

    // Validation du nom
    const lastNameResult = FieldValidationService.validateNameField(data.lastName, "nom");
    if (!lastNameResult.isValid) {
      errors.lastName = lastNameResult.errors[0];
    } else {
      sanitizedData.lastName = lastNameResult.sanitizedValue;
    }

    // Validation de l'email
    const emailResult = FieldValidationService.validateEmailField(data.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.errors[0];
    } else {
      sanitizedData.email = emailResult.sanitizedValue;
    }

    // Validation du mot de passe
    const passwordResult = FieldValidationService.validatePasswordField(data.password);
    if (!passwordResult.isValid) {
      errors.password = passwordResult.errors.join(" ");
    } else {
      sanitizedData.password = passwordResult.sanitizedValue;
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      isValid,
      errors,
      sanitizedData: isValid ? sanitizedData : undefined
    };
  }

  /**
   * Valider un formulaire de profil
   */
  static validateProfileForm(data: {
    firstName: string;
    lastName: string;
    email: string;
  }): ObjectValidationResult<typeof data> {
    const errors: Record<string, string> = {};
    const sanitizedData: any = {};

    // Validation du prénom
    const firstNameResult = FieldValidationService.validateNameField(data.firstName, "prénom");
    if (!firstNameResult.isValid) {
      errors.firstName = firstNameResult.errors[0];
    } else {
      sanitizedData.firstName = firstNameResult.sanitizedValue;
    }

    // Validation du nom
    const lastNameResult = FieldValidationService.validateNameField(data.lastName, "nom");
    if (!lastNameResult.isValid) {
      errors.lastName = lastNameResult.errors[0];
    } else {
      sanitizedData.lastName = lastNameResult.sanitizedValue;
    }

    // Validation de l'email
    const emailResult = FieldValidationService.validateEmailField(data.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.errors[0];
    } else {
      sanitizedData.email = emailResult.sanitizedValue;
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      isValid,
      errors,
      sanitizedData: isValid ? sanitizedData : undefined
    };
  }
}

/**
 * Service de validation pour les données métier
 * Responsabilité : Validation de données spécifiques au domaine
 */
export class BusinessValidationService {
  /**
   * Valider un ID d'étoile
   */
  static validateStarId(starId: unknown): ValidationResult {
    if (typeof starId !== "number" || isNaN(starId) || starId <= 0) {
      return {
        isValid: false,
        errors: ["ID d'étoile invalide."]
      };
    }

    return {
      isValid: true,
      errors: [],
      sanitizedValue: starId.toString()
    };
  }

  /**
   * Valider une quantité
   */
  static validateQuantity(quantity: unknown): ValidationResult {
    if (typeof quantity !== "number" || isNaN(quantity) || quantity <= 0 || quantity > 100) {
      return {
        isValid: false,
        errors: ["La quantité doit être entre 1 et 100."]
      };
    }

    return {
      isValid: true,
      errors: [],
      sanitizedValue: quantity.toString()
    };
  }

  /**
   * Valider un prix
   */
  static validatePrice(price: unknown): ValidationResult {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;

    if (typeof numPrice !== "number" || isNaN(numPrice) || numPrice < 0) {
      return {
        isValid: false,
        errors: ["Prix invalide."]
      };
    }

    return {
      isValid: true,
      errors: [],
      sanitizedValue: numPrice.toString()
    };
  }
}