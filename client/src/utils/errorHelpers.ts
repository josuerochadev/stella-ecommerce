// client/src/utils/errorHelpers.ts
// Responsabilité unique : Utilitaires de gestion et formatage d'erreurs

/**
 * Extrait un message d'erreur lisible depuis n'importe quel type d'erreur
 * Responsabilité : Normalisation des messages d'erreurs
 *
 * @param error - L'erreur à traiter (Error, string, unknown)
 * @param fallbackMessage - Message par défaut si l'erreur n'a pas de message
 * @returns Message d'erreur formaté
 *
 * @example
 * getErrorMessage(new Error("Network error"), "Une erreur est survenue")
 * // => "Network error"
 *
 * getErrorMessage("Something went wrong", "Une erreur est survenue")
 * // => "Something went wrong"
 *
 * getErrorMessage(null, "Une erreur est survenue")
 * // => "Une erreur est survenue"
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "Une erreur inattendue est survenue.",
): string => {
  // Cas 1: Error standard
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  // Cas 2: String
  if (typeof error === "string") {
    return error || fallbackMessage;
  }

  // Cas 3: Objet avec propriété message
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string") {
      return message || fallbackMessage;
    }
  }

  // Cas 4: Erreur Axios avec response.data.message
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = (error.response as { data: unknown }).data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message: unknown }).message;
      if (typeof message === "string") {
        return message || fallbackMessage;
      }
    }
  }

  // Fallback par défaut
  return fallbackMessage;
};

/**
 * Crée un message d'erreur formaté avec un préfixe
 * Responsabilité : Formatage cohérent des messages d'erreur
 *
 * @param error - L'erreur à traiter
 * @param prefix - Préfixe à ajouter au message
 * @param fallback - Message par défaut optionnel
 * @returns Message d'erreur formaté avec préfixe
 *
 * @example
 * formatErrorMessage(error, "Failed to fetch cart")
 * // => "Failed to fetch cart: Network error"
 */
export const formatErrorMessage = (
  error: unknown,
  prefix: string,
  fallback = "Unknown error",
): string => {
  const message = getErrorMessage(error, fallback);
  return `${prefix}: ${message}`;
};

/**
 * Crée une Error avec un message formaté
 * Responsabilité : Création d'erreurs typées avec messages cohérents
 *
 * @param error - L'erreur d'origine
 * @param prefix - Préfixe descriptif
 * @param fallback - Message par défaut optionnel
 * @returns Nouvelle instance d'Error formatée
 *
 * @example
 * throw createFormattedError(error, "Failed to save data")
 */
export const createFormattedError = (
  error: unknown,
  prefix: string,
  fallback = "Unknown error",
): Error => {
  const message = formatErrorMessage(error, prefix, fallback);
  return new Error(message);
};
