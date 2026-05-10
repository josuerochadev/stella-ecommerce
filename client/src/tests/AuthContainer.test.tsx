// src/tests/components/AuthContainer.test.tsx

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import AuthContainer from "@/components/AuthContainer";
import { AuthProvider } from "@/context/AuthContext";

const renderAuth = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/auth"]}>
        <Routes>
          <Route path="/auth" element={<AuthContainer />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

describe("AuthContainer Component", () => {
  test("renders Login component by default", () => {
    renderAuth();

    expect(screen.getByRole("heading", { name: /Connexion/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Inscrivez-vous ici/i })).toBeInTheDocument();
  });

  test("toggles to Register component when button is clicked", () => {
    renderAuth();

    fireEvent.click(screen.getByRole("button", { name: /Inscrivez-vous ici/i }));

    expect(screen.getByRole("heading", { name: /Inscription/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Connectez-vous ici/i })).toBeInTheDocument();
  });

  test("login form has required email and password fields", () => {
    renderAuth();

    expect(screen.getByPlaceholderText("exemple@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Votre mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
  });
});
