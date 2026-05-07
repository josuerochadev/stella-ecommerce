import { useCallback, useState } from "react";

/**
 * Hook reutilisable pour gerer les erreurs de formulaire par champ.
 * Remplace les multiples useState individuels (emailError, passwordError, etc.)
 */
export const useFormErrors = <T extends string>() => {
  const [errors, setErrors] = useState<Partial<Record<T, string>>>({});

  const setFieldError = useCallback((field: T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getError = useCallback(
    (field: T): string => {
      return errors[field] || "";
    },
    [errors],
  );

  return { errors, setFieldError, clearErrors, getError };
};
