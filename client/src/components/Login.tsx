import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import FadeInSection from "./FadeInSection";
import FormInput from "./FormInput";
import FormContainer from "./FormContainer";
import { useValidatedApiCall } from "../hooks/useApiCall";
import { validateEmail, sanitizeText } from "../utils/security";
import type { LoginResponse } from "../services/authService";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const message = location.state?.message || "Connectez-vous pour accéder à votre compte.";
  const from = location.state?.from || "/profile";

  const { isLoading, error, execute } = useValidatedApiCall<LoginResponse, { email: string; password: string }>(
    (data) => {
      const sanitizedEmail = sanitizeText(data.email).trim();
      const sanitizedPassword = data.password.trim();

      if (!sanitizedEmail) {
        setEmailError('L\'email est requis');
        return 'L\'email est requis';
      }

      if (!validateEmail(sanitizedEmail)) {
        setEmailError('Format d\'email invalide');
        return 'Format d\'email invalide';
      }

      if (!sanitizedPassword) {
        setPasswordError('Le mot de passe est requis');
        return 'Le mot de passe est requis';
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
        emailInputRef.current?.focus();
      }
    }
  );

  // Focus sur le premier champ au chargement
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const sanitizedEmail = sanitizeText(email).trim();
    const sanitizedPassword = password.trim();

    await execute(
      { email: sanitizedEmail, password: sanitizedPassword },
      (data) => loginUser({ email: data.email, password: data.password })
    );
  };

  return (
    <FadeInSection>
      <div className="container mx-auto px-4">
        <p className="text-center text-lg mb-6" aria-live="polite">
          {message}
        </p>

        <FormContainer
          error={error || undefined}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        >
          <FormInput
            ref={emailInputRef}
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@email.com"
            autoComplete="email"
            isRequired
            error={emailError}
            description="Saisissez votre adresse e-mail de connexion"
          />

          <FormInput
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            isRequired
            error={passwordError}
            description="Saisissez votre mot de passe de connexion"
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
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </FormContainer>
      </div>
    </FadeInSection>
  );
};

export default Login;
