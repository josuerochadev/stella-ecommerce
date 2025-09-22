import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import FadeInSection from "./FadeInSection";
import { ARIA_LABELS, StatusMessage } from "../utils/accessibility";
import { useFormAnnouncements } from "../hooks/useFocusManagement";
import { validateEmail, sanitizeText } from "../utils/security";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const { announceError, announceSuccess, Announcer } = useFormAnnouncements();

  const message = location.state?.message || "Connectez-vous pour accéder à votre compte.";
  const from = location.state?.from || "/profile";

  // Focus sur le premier champ au chargement
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation côté client avec sécurité
    const sanitizedEmail = sanitizeText(email).trim();
    const sanitizedPassword = password.trim(); // Ne pas sanitize le mot de passe, juste trimmer

    if (!sanitizedEmail) {
      announceError('email', 'L\'email est requis');
      setError('L\'email est requis');
      setIsLoading(false);
      emailInputRef.current?.focus();
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      announceError('email', 'Format d\'email invalide');
      setError('Format d\'email invalide');
      setIsLoading(false);
      emailInputRef.current?.focus();
      return;
    }

    if (!sanitizedPassword) {
      announceError('mot de passe', 'Le mot de passe est requis');
      setError('Le mot de passe est requis');
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({ email: sanitizedEmail, password: sanitizedPassword });
      const token = response.accessToken;

      if (token) {
        announceSuccess('Connexion réussie, redirection en cours...');
        login(token);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const errorMessage = (err as Error)?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
      setError(errorMessage);
      announceError('connexion', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeInSection>
      <div className="container mx-auto px-4 max-w-md">
        <Announcer />
        <p
          className="text-center text-lg mb-6"
          aria-live="polite"
        >
          {message}
        </p>

        {error && (
          <StatusMessage
            type="error"
            message={error}
            id="login-error"
          />
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 bg-secondary text-text p-6 rounded-md shadow-lg"
          noValidate
          aria-labelledby="login-title"
          aria-describedby={error ? "login-error" : undefined}
        >
          <h2 id="login-title" className="sr-only">Formulaire de connexion</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-serif mb-2">
              Email <span aria-label="champ requis" className="text-red-500">*</span>
            </label>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="exemple@email.com"
              required
              autoComplete="email"
              aria-required="true"
              aria-invalid={error?.includes('email') ? 'true' : 'false'}
              aria-describedby="email-description"
            />
            <div id="email-description" className="sr-only">
              Saisissez votre adresse e-mail de connexion
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-serif mb-2">
              Mot de passe <span aria-label="champ requis" className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Votre mot de passe"
              required
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={error?.includes('mot de passe') ? 'true' : 'false'}
              aria-describedby="password-description"
            />
            <div id="password-description" className="sr-only">
              Saisissez votre mot de passe de connexion
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              aria-describedby="login-status"
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
            <div id="login-status" className="sr-only" aria-live="polite">
              {isLoading ? 'Connexion en cours, veuillez patienter' : ''}
            </div>
          </div>
        </form>
      </div>
    </FadeInSection>
  );
};

export default Login;
