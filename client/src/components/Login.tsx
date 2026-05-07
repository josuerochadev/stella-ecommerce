import { useAuth } from "@/context/AuthContext";
import { useValidatedApiCall } from "@/hooks/useApiCall";
import { loginUser } from "@/services/api";
import type { LoginResponse } from "@/services/authService";
import { FieldValidationService } from "@/services/validationService";
import { sanitizeText } from "@/utils/security";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FadeInSection from "./FadeInSection";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";

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

  const { isLoading, error, execute } = useValidatedApiCall<
    LoginResponse,
    { email: string; password: string }
  >(
    (data) => {
      const emailResult = FieldValidationService.validateEmailField(data.email);
      if (!emailResult.isValid) {
        setEmailError(emailResult.errors[0]);
        return emailResult.errors[0];
      }

      const passwordResult = FieldValidationService.validatePasswordField(data.password);
      if (!passwordResult.isValid) {
        setPasswordError(passwordResult.errors[0]);
        return passwordResult.errors[0];
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
      },
    },
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

    await execute({ email: sanitizedEmail, password: sanitizedPassword }, (data) =>
      loginUser({ email: data.email, password: data.password }),
    );
  };

  return (
    <FadeInSection>
      <div className="container mx-auto px-4">
        <p className="text-center text-lg mb-6" aria-live="polite">
          {message}
        </p>

        <FormContainer error={error || undefined} isLoading={isLoading} onSubmit={handleSubmit}>
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
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2" aria-hidden="true">
                    ⟳
                  </span>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
        </FormContainer>
      </div>
    </FadeInSection>
  );
};

export default Login;
