import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorService, type ApiError, type ErrorDetails } from "@/services/errorService";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/app";

export const useErrorHandler = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleError = useCallback((error: ApiError | Error) => {
    const apiError = error instanceof Error ? errorService.handleApiError(error) : error;

    // Gestion automatique des erreurs d'authentification
    if (errorService.isAuthError(apiError)) {
      logout();
      navigate(ROUTES.LOGIN, {
        state: { message: 'Votre session a expiré. Veuillez vous reconnecter.' }
      });
      return;
    }

    // Log de l'erreur
    errorService.logError({
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      errors: apiError.errors,
      requestId: apiError.requestId,
      timestamp: new Date().toISOString(),
    });

    return apiError;
  }, [navigate, logout]);

  const handleGlobalError = useCallback((error: ErrorDetails) => {
    // Ici on pourrait envoyer l'erreur à un service de monitoring
    // comme Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // sendToMonitoring(error);
    }
  }, []);

  useEffect(() => {
    errorService.registerErrorHandler('global', handleGlobalError);
    return () => {
      errorService.unregisterErrorHandler('global');
    };
  }, [handleGlobalError]);

  return {
    handleError,
    formatError: errorService.formatErrorMessage.bind(errorService),
    isNetworkError: errorService.isNetworkError.bind(errorService),
    isAuthError: errorService.isAuthError.bind(errorService),
    isValidationError: errorService.isValidationError.bind(errorService),
  };
};