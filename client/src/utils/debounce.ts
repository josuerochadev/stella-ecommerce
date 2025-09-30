// client/src/utils/debounce.ts
// Responsabilité unique : Utilitaire de debouncing réutilisable

/**
 * Utilitaire de debouncing
 * Responsabilité unique : Retarder l'exécution d'une fonction
 * Note: Uses `any` for maximum flexibility with function arguments
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}