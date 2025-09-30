import { useState, memo, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/services/api";
import { useValidatedApiCall } from "@/hooks/useApiCall";
import { validateEmail, sanitizeText } from "@/utils/security";
import FadeInSection from "./FadeInSection";
import FormInput from "./FormInput";
import FormContainer from "./FormContainer";
import type { RegisterResponse } from "@/services/authService";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  const from = location.state?.from || "/profile";

  const { isLoading, error, execute } = useValidatedApiCall<RegisterResponse, { firstName: string; lastName: string; email: string; password: string }>(
    (data) => {
      const sanitizedFirstName = sanitizeText(data.firstName).trim();
      const sanitizedLastName = sanitizeText(data.lastName).trim();
      const sanitizedEmail = sanitizeText(data.email).trim();
      const sanitizedPassword = data.password.trim();

      if (!sanitizedFirstName) {
        setFirstNameError('Le prénom est requis');
        return 'Le prénom est requis';
      }

      if (!sanitizedLastName) {
        setLastNameError('Le nom est requis');
        return 'Le nom est requis';
      }

      if (!sanitizedEmail) {
        setEmailError('L\'email est requis');
        return 'L\'email est requis';
      }

      if (!validateEmail(sanitizedEmail)) {
        setEmailError('Format d\'email invalide');
        return 'Format d\'email invalide';
      }

      if (!sanitizedPassword || sanitizedPassword.length < 8) {
        setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
        return 'Le mot de passe doit contenir au moins 8 caractères';
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
      }
    }
  );

  // Focus sur le premier champ au chargement
  useEffect(() => {
    if (firstNameInputRef.current) {
      firstNameInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");

    const sanitizedFirstName = sanitizeText(firstName).trim();
    const sanitizedLastName = sanitizeText(lastName).trim();
    const sanitizedEmail = sanitizeText(email).trim();
    const sanitizedPassword = password.trim();

    await execute(
      { firstName: sanitizedFirstName, lastName: sanitizedLastName, email: sanitizedEmail, password: sanitizedPassword },
      (data) => registerUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password })
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
            error={firstNameError}
          />

          <FormInput
            label="Nom"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            autoComplete="family-name"
            isRequired
            error={lastNameError}
          />

          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            autoComplete="email"
            isRequired
            error={emailError}
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
            error={passwordError}
            description="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
          />

          <div className="text-center">
            <button
              type="submit"
              className="btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2" aria-hidden="true">⟳</span>
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
