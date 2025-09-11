import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import FadeInSection from "./FadeInSection";

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/profile";
  const message = location.state?.message || "Connectez-vous pour accéder à votre compte.";

  if (isAuthenticated) {
    return <Navigate to={from} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const token = response.token;

      if (token) {
        login(token);
        navigate(from);
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <FadeInSection>
      <div className="container mx-auto px-4 max-w-md">
        <p className="text-center text-lg mb-6">{message}</p>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-secondary text-text p-6 rounded-md shadow-lg"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-serif mb-2">
              Email :
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
              placeholder="Email"
              aria-label="Adresse e-mail"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-serif mb-2">
              Mot de passe :
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
              placeholder="Mot de passe"
              aria-label="Mot de passe"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </FadeInSection>
  );
};

export default Login;
