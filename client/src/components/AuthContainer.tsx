import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const AuthContainer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const mode = location.state?.mode || "login";

  const [isLogin, setIsLogin] = useState(mode === "login");

  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="container mx-auto pt-20 px-4 max-w-md">
      <h1 className="text-4xl font-display mb-8 text-center">
        {isLogin ? "Connexion" : "Inscription"}
      </h1>
      {isLogin ? <Login /> : <Register />}
      <div className="text-center mt-6">
        {isLogin ? (
          <div className="text-lg font-serif flex flex-col items-center">
            <p>Pas encore de compte ?</p>
            <button type="button" onClick={() => setIsLogin(false)} className="btn mt-2">
              Inscrivez-vous ici
            </button>
          </div>
        ) : (
          <div className="text-lg font-serif flex flex-col items-center">
            <p>Vous avez déjà un compte ?</p>
            <button type="button" onClick={() => setIsLogin(true)} className="btn mt-2">
              Connectez-vous ici
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
