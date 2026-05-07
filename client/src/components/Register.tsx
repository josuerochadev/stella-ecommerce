import { useAuth } from "@/context/AuthContext";
import { useValidatedApiCall } from "@/hooks/useApiCall";
import { useFormErrors } from "@/hooks/useFormErrors";
import { registerUser } from "@/services/api";
import type { RegisterResponse } from "@/services/authService";
import { FormValidationService } from "@/services/validationService";
import { memo, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FadeInSection from "./FadeInSection";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { getError, setFieldError, clearErrors } = useFormErrors<
    "firstName" | "lastName" | "email" | "password"
  >();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  const from = location.state?.from || "/profile";

  const { isLoading, error, execute } = useValidatedApiCall<
    RegisterResponse,
    { firstName: string; lastName: string; email: string; password: string }
  >(
    (data) => {
      const result = FormValidationService.validateRegistrationForm(data);
      if (!result.isValid) {
        for (const [field, msg] of Object.entries(result.errors)) {
          setFieldError(field as "firstName" | "lastName" | "email" | "password", msg);
        }
        return Object.values(result.errors)[0];
      }
      return true;
    },
    {
      onSuccess: (response) => {
        if (response.accessToken) {
          login(response.accessToken);
          navigate(from, { replace: true });
        }
      },
      onError: () => {
        firstNameInputRef.current?.focus();
      },
    },
  );

  // Focus sur le premier champ au chargement
  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    await execute(
      {
        firstName,
        lastName,
        email,
        password,
      },
      (data) =>
        registerUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
    );
  };

  return (
    <FadeInSection>
      <div className="container mx-auto px-4">
        <FormContainer
          title="Créer un compte"
          description="Inscrivez-vous pour commencer votre voyage dans les étoiles"
          error={error || undefined}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        >
          <FormInput
            ref={firstNameInputRef}
            label="Prénom"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            autoComplete="given-name"
            isRequired
            error={getError("firstName")}
          />

          <FormInput
            label="Nom"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            autoComplete="family-name"
            isRequired
            error={getError("lastName")}
          />

          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            autoComplete="email"
            isRequired
            error={getError("email")}
            description="Votre adresse email pour vous connecter"
          />

          <FormInput
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 caractères"
            autoComplete="new-password"
            isRequired
            error={getError("password")}
            description="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
          />

          <div className="text-center">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2" aria-hidden="true">
                    ⟳
                  </span>
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </div>
        </FormContainer>
      </div>
    </FadeInSection>
  );
};

export default memo(Register);
