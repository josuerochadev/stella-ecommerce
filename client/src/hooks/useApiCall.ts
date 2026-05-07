import { useCallback, useState } from "react";
import { useErrorHandler } from "./useErrorHandler";

interface ApiCallState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiCallOptions<T = unknown> {
  showGlobalError?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useApiCall = <T = unknown>(options: UseApiCallOptions<T> = {}) => {
  const { showGlobalError = true, onSuccess, onError } = options;
  const { handleError } = useErrorHandler();

  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiFunction: () => Promise<T>): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await apiFunction();
        setState({
          data: result,
          isLoading: false,
          error: null,
        });

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        if (showGlobalError) {
          handleError(error instanceof Error ? error : new Error(String(error)));
        }

        if (onError) {
          onError(errorMessage);
        }

        return null;
      }
    },
    [handleError, onSuccess, onError, showGlobalError],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

// Hook spécialisé pour les opérations de collection (panier, wishlist)
export const useCollectionOperation = (
  type: "cart" | "wishlist",
  options: UseApiCallOptions = {},
) => {
  const apiCall = useApiCall(options);

  const executeWithAuth = useCallback(
    async (apiFunction: () => Promise<unknown>, requireAuth = true) => {
      if (requireAuth) {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error(
            `Veuillez vous connecter pour ${
              type === "cart" ? "ajouter au panier" : "ajouter aux favoris"
            }.`,
          );
        }
      }

      return apiCall.execute(apiFunction);
    },
    [apiCall, type],
  );

  return {
    ...apiCall,
    execute: executeWithAuth,
  };
};

// Hook pour les opérations avec validation
export const useValidatedApiCall = <T = unknown, D = unknown>(
  validator: (data: D) => boolean | string,
  options: UseApiCallOptions<T> = {},
) => {
  const apiCall = useApiCall<T>(options);

  const executeWithValidation = useCallback(
    async (data: D, apiFunction: (validatedData: D) => Promise<T>): Promise<T | null> => {
      const validationResult = validator(data);

      if (validationResult !== true) {
        const errorMessage =
          typeof validationResult === "string" ? validationResult : "Données invalides";

        apiCall.reset();
        if (options.onError) {
          options.onError(errorMessage);
        }
        return null;
      }

      return apiCall.execute(() => apiFunction(data));
    },
    [apiCall, validator, options],
  );

  return {
    ...apiCall,
    execute: executeWithValidation,
  };
};
