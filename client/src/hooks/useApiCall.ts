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

/**
 * Generic hook for executing async API calls with loading/error state management.
 * Handles error display via the global error handler and provides success/error callbacks.
 *
 * @param options.showGlobalError - Whether to display errors via the global handler (default: true)
 * @param options.onSuccess - Callback fired with the result on successful execution
 * @param options.onError - Callback fired with the error message on failure
 * @returns {object} State (data, isLoading, error) + execute(apiFunction) and reset()
 *
 * @example
 * const { data, isLoading, execute } = useApiCall<Star[]>();
 * await execute(() => StarService.fetchStars());
 */
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

/**
 * Specialized hook for cart/wishlist operations that require authentication.
 * Wraps useApiCall with an auth check before execution.
 *
 * @param type - Collection type ("cart" or "wishlist"), used for error messages
 * @param options - Same options as useApiCall
 */
export const useCollectionOperation = (
  _type: "cart" | "wishlist",
  options: UseApiCallOptions = {},
) => {
  const apiCall = useApiCall(options);

  const executeWithAuth = useCallback(
    async (apiFunction: () => Promise<unknown>) => {
      return apiCall.execute(apiFunction);
    },
    [apiCall],
  );

  return {
    ...apiCall,
    execute: executeWithAuth,
  };
};

/**
 * Hook that validates data before executing an API call.
 * If validation fails, the error callback is fired without making the request.
 *
 * @param validator - Returns true if valid, or an error message string if invalid
 * @param options - Same options as useApiCall
 */
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
