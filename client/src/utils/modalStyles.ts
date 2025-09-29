// client/src/utils/modalStyles.ts
// Responsabilité unique : Configuration des styles de modal par type

export type ModalType = 'danger' | 'warning' | 'info' | 'custom';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalTypeConfig {
  iconColor: string;
  confirmButton: string;
}

/**
 * Service de styles pour les modales
 * Responsabilité unique : Génération des styles selon le type de modal
 */
export class ModalStylesService {
  /**
   * Obtenir la configuration de styles selon le type de modal
   * Responsabilité : Configuration visuelle par type
   */
  static getTypeConfig(type: ModalType): ModalTypeConfig | null {
    const configMap: Record<Exclude<ModalType, 'custom'>, ModalTypeConfig> = {
      danger: {
        iconColor: 'text-red-400',
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
      },
      warning: {
        iconColor: 'text-yellow-400',
        confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      },
      info: {
        iconColor: 'text-blue-400',
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
      },
    };

    return type === 'custom' ? null : configMap[type];
  }

  /**
   * Obtenir les classes de taille de modal
   * Responsabilité : Dimensionnement de la modal
   */
  static getSizeClasses(size: ModalSize): string {
    const sizeMap: Record<ModalSize, string> = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };

    return sizeMap[size];
  }

  /**
   * Obtenir les classes de base pour la modal
   * Responsabilité : Styles de base réutilisables
   */
  static getBaseModalClasses(size: ModalSize): string {
    return `
      relative mx-auto my-8 w-full ${this.getSizeClasses(size)}
      bg-white rounded-lg shadow-xl transform transition-all
      max-h-[90vh] overflow-hidden
    `.trim().replace(/\s+/g, ' ');
  }

  /**
   * Obtenir les classes pour l'overlay
   * Responsabilité : Styles de l'arrière-plan
   */
  static getOverlayClasses(): string {
    return `
      fixed inset-0 bg-black bg-opacity-50
      flex items-center justify-center p-4 z-50
      transition-opacity duration-200
    `.trim().replace(/\s+/g, ' ');
  }
}