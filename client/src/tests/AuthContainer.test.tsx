// src/tests/components/AuthContainer.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import AuthContainer from "../components/AuthContainer";
import { AuthProvider } from "../context/AuthContext";

describe("AuthContainer Component", () => {
  test("renders Login component by default", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/auth"]}>
          <Routes>
            <Route path="/auth" element={<AuthContainer />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Inscrivez-vous ici/i })).toBeInTheDocument();
  });

  test("toggles to Register component when button is clicked", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/auth"]}>
          <Routes>
            <Route path="/auth" element={<AuthContainer />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Inscrivez-vous ici/i }));

    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Connectez-vous ici/i })).toBeInTheDocument();
  });

  test("redirects to /profile if authenticated", () => {
    // Mock localStorage
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") return "fake-token";
      return null;
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/auth"]}>
          <Routes>
            <Route path="/auth" element={<AuthContainer />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Profile Page/i)).toBeInTheDocument();
  });
});
