// client/src/components/UserProfileSection.tsx
// Responsabilité unique : Gestion du profil utilisateur

import { useState, memo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import type { User } from "@/types";

interface UserProfileSectionProps {
  user: User;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { updateProfile, deleteAccount, loading } = useUserStore();
  const { showSuccess, showConfirm } = useNotificationStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = { firstName, lastName, email };
      await updateProfile(updatedData);
      showSuccess("Profil mis à jour avec succès !");
      setIsEditingProfile(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour du profil.");
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Déconnexion",
      "Vous allez être déconnecté. Vous serez redirigé vers la page d'accueil.",
      "warning"
    );
    if (confirmed) {
      logout();
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirm(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      "danger"
    );
    if (confirmed) {
      try {
        await deleteAccount();
        showSuccess("Compte supprimé avec succès.");
        logout();
        navigate("/");
      } catch (error) {
        // Error already handled by store
      }
    }
  };

  return (
    <div role="form" className="space-y-4 bg-secondary text-text p-6 rounded-md shadow-lg">
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      {isEditingProfile ? (
        <form onSubmit={handleProfileUpdate}>
          <div>
            <label className="block text-sm font-serif mb-2">Prénom :</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
              aria-label="Prénom"
              placeholder="Prénom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-serif mb-2">Nom :</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
              aria-label="Nom"
              placeholder="Nom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-serif mb-2">Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
              aria-label="Email"
              placeholder="Email"
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
          <button type="button" className="btn mt-4" onClick={() => setIsEditingProfile(false)}>
            Annuler
          </button>
        </form>
      ) : (
        <>
          <p className="text-lg font-serif">
            Nom : {firstName} {lastName}
          </p>
          <p className="text-lg font-serif">Email : {email}</p>
          <button type="button" className="btn" onClick={() => setIsEditingProfile(true)}>
            Modifier le profil
          </button>
          <button type="button" className="btn" onClick={handleLogout}>
            Se déconnecter
          </button>
          <button
            type="button"
            className="btn bg-red-500 text-white mt-4"
            onClick={handleDeleteAccount}
          >
            Supprimer le compte
          </button>
        </>
      )}
    </div>
  );
};

export default memo(UserProfileSection);