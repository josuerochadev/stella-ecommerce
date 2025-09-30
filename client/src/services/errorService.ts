import { HTTP_STATUS } from "@/constants/app";

export interface ErrorDetails {
  message: string;
  code?: string;
  status?: number;
  timestamp?: string;
  requestId?: string;
  errors?: Record<string, string>;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  errors?: Record<string, string>;
  requestId?: string;
}

export class ErrorService {
  private static instance: ErrorService;
  private errorHandlers: Map<string, (error: ErrorDetails) => void> = new Map();

  private constructor() {}

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  public handleApiError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
      const errorObj = error as any; // Type assertion pour accéder aux propriétés
      const apiError = new Error(errorObj.response.data?.message || 'Une erreur est survenue') as ApiError;
      apiError.status = errorObj.response.status;
      apiError.code = errorObj.response.data?.code;
      apiError.errors = errorObj.response.data?.errors;
      apiError.requestId = errorObj.response.data?.requestId;

      this.logError({
        message: apiError.message,
        status: apiError.status,
        code: apiError.code,
        errors: apiError.errors,
        requestId: apiError.requestId,
        timestamp: new Date().toISOString(),
      });

      return apiError;
    }

    if (error && typeof error === 'object' && 'request' in error) {
      const networkError = new Error('Problème de connexion réseau') as ApiError;
      networkError.status = 0;
      networkError.code = 'NETWORK_ERROR';

      this.logError({
        message: networkError.message,
        status: networkError.status,
        code: networkError.code,
        timestamp: new Date().toISOString(),
      });

      return networkError;
    }

    const genericError = new Error('Une erreur inattendue est survenue') as ApiError;
    genericError.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    genericError.code = 'UNKNOWN_ERROR';

    this.logError({
      message: genericError.message,
      status: genericError.status,
      code: genericError.code,
      timestamp: new Date().toISOString(),
    });

    return genericError;
  }

  public logError(error: ErrorDetails): void {
    console.error('Error logged:', error);

    // En développement, log plus détaillé
    if (process.env.NODE_ENV === 'development') {
      console.table(error);
    }

    // Appeler les handlers enregistrés
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });
  }

  public registerErrorHandler(name: string, handler: (error: ErrorDetails) => void): void {
    this.errorHandlers.set(name, handler);
  }

  public unregisterErrorHandler(name: string): void {
    this.errorHandlers.delete(name);
  }

  public formatErrorMessage(error: ApiError): string {
    if (error.status === HTTP_STATUS.UNAUTHORIZED) {
      return 'Votre session a expiré. Veuillez vous reconnecter.';
    }

    if (error.status === HTTP_STATUS.FORBIDDEN) {
      return 'Vous n\'êtes pas autorisé à effectuer cette action.';
    }

    if (error.status === HTTP_STATUS.NOT_FOUND) {
      return 'La ressource demandée n\'a pas été trouvée.';
    }

    if (error.status === HTTP_STATUS.BAD_REQUEST && error.errors) {
      const fieldErrors = Object.values(error.errors).join(', ');
      return `Erreur de validation : ${fieldErrors}`;
    }

    if (error.status === 0) {
      return 'Problème de connexion. Vérifiez votre connexion internet.';
    }

    return error.message || 'Une erreur inattendue est survenue.';
  }

  public isNetworkError(error: ApiError): boolean {
    return error.status === 0 || error.code === 'NETWORK_ERROR';
  }

  public isAuthError(error: ApiError): boolean {
    return error.status === HTTP_STATUS.UNAUTHORIZED || error.status === HTTP_STATUS.FORBIDDEN;
  }

  public isValidationError(error: ApiError): boolean {
    return error.status === HTTP_STATUS.BAD_REQUEST && !!error.errors;
  }
}

export const errorService = ErrorService.getInstance();