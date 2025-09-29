import { useState, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";
import { useRegistrationValidation } from "../hooks/useRegistrationValidation";
import FadeInSection from "./FadeInSection";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { validateRegistrationData } = useRegistrationValidation();

  const from = location.state?.from || "/profile";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation déléguée au hook spécialisé
    const validationResult = validateRegistrationData({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    if (!validationResult.isValid || !validationResult.sanitizedData) {
      return; // Les erreurs sont déjà gérées par le hook
    }

    try {
      const response = await registerUser(validationResult.sanitizedData);
      const token = response.token;

      if (token) {
        login(token);
        navigate(from);
      }
    } catch (_error) {
      // L'erreur sera gérée par l'API et affichée à l'utilisateur
    }
  };

  return (
    <FadeInSection>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-secondary text-text p-6 rounded-md shadow-lg"
      >
        <div>
          <label className="block text-sm font-serif mb-2">Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            className="w-full p-3 rounded-md bg-primary text-text"
            placeholder="Nom d'utilisateur"
            aria-label="Nom d'utilisateur"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-serif mb-2">Prénom :</label>
          <input
            type="text"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            className="w-full p-3 rounded-md bg-primary text-text"
            placeholder="Prénom"
            aria-label="Prénom"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-serif mb-2">Nom :</label>
          <input
            type="text"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            className="w-full p-3 rounded-md bg-primary text-text"
            placeholder="Nom"
            aria-label="Nom"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-serif mb-2">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-primary text-text"
            placeholder="Email"
            aria-label="Email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-serif mb-2">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-primary text-text"
            placeholder="Mot de passe"
            aria-label="Mot de passe"
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn">
            S'inscrire
          </button>
        </div>
      </form>
    </FadeInSection>
  );
};

export default memo(Register);
