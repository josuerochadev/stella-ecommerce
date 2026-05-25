// client/src/components/UserProfileSection.tsx
// Responsabilité unique : Gestion du profil utilisateur

import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/services/userService";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useUserStore } from "@/stores/useUserStore";
import type { User } from "@/types";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfileSectionProps {
  user: User;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { updateProfile, deleteAccount, loading } = useUserStore();
  const { showSuccess, showConfirm } = useNotificationStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
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
    } catch (_error) {
      setErrorMessage("Erreur lors de la mise à jour du profil.");
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Déconnexion",
      "Vous allez être déconnecté. Vous serez redirigé vers la page d'accueil.",
      "warning",
    );
    if (confirmed) {
      logout();
      navigate("/");
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      setErrorMessage("Veuillez entrer votre mot de passe pour confirmer.");
      return;
    }
    const confirmed = await showConfirm(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      "danger",
    );
    if (confirmed) {
      try {
        await deleteAccount(deletePassword);
        showSuccess("Compte supprimé avec succès.");
        logout();
        navigate("/");
      } catch (_error) {
        setErrorMessage("Mot de passe incorrect ou erreur lors de la suppression.");
        setDeletePassword("");
      }
    }
  };

  return (
    <div className="space-y-4 bg-secondary text-text p-6 rounded-md shadow-lg">
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      {isEditingProfile ? (
        <form onSubmit={handleProfileUpdate}>
          <div>
            <label htmlFor="profile-firstName" className="block text-sm font-serif mb-2">
              Prénom :
            </label>
            <input
              id="profile-firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
              placeholder="Prénom"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-lastName" className="block text-sm font-serif mb-2">
              Nom :
            </label>
            <input
              id="profile-lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
              placeholder="Nom"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-serif mb-2">
              Email :
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-primary text-text"
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
            className="btn-secondary py-2 px-4 rounded-md"
            onClick={async () => {
              try {
                const data = await UserService.exportData();
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `stella-data-export-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showSuccess("Vos données ont été exportées.");
              } catch (_error) {
                setErrorMessage("Erreur lors de l'export des données.");
              }
            }}
          >
            Exporter mes données
          </button>
          {isDeletingAccount ? (
            <form onSubmit={handleDeleteAccount} className="mt-4 space-y-3">
              <p className="text-sm text-red-400">
                Entrez votre mot de passe pour confirmer la suppression :
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full p-3 rounded-md bg-primary text-text"
                aria-label="Mot de passe de confirmation"
                placeholder="Votre mot de passe"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn bg-red-500 text-white" disabled={loading}>
                  {loading ? "Suppression..." : "Confirmer la suppression"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setIsDeletingAccount(false);
                    setDeletePassword("");
                    setErrorMessage("");
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="btn bg-red-500 text-white mt-4"
              onClick={() => setIsDeletingAccount(true)}
            >
              Supprimer le compte
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default memo(UserProfileSection);
