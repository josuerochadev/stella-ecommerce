import { useState, memo } from "react";
import { useUserStore } from "@/stores/useUserStore";
import FormInput from "./FormInput";

const ChangePasswordForm: React.FC = () => {
  const { changePassword, loading } = useUserStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Erreur lors du changement de mot de passe.");
    }
  };

  return (
    <div className="bg-secondary text-text p-6 rounded-md shadow-lg mt-4">
      <h3 className="text-lg font-display mb-4">Changer le mot de passe</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Mot de passe actuel"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          isRequired
        />
        <FormInput
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          isRequired
          description="Minimum 8 caracteres"
        />
        <FormInput
          label="Confirmer le nouveau mot de passe"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          isRequired
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">Mot de passe modifie avec succes.</p>
        )}

        <button type="submit" disabled={loading} className="btn">
          {loading ? "Modification..." : "Modifier le mot de passe"}
        </button>
      </form>
    </div>
  );
};

export default memo(ChangePasswordForm);
