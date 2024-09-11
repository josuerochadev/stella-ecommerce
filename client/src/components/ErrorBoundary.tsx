import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <h1 className="text-4xl font-display mb-4">Oups, une erreur est survenue !</h1>
          <p className="text-lg mb-6">
            Désolé pour le désagrément. Vous pouvez essayer de recharger l'application.
          </p>
          <div className="mt-4 space-x-4">
            <button type="button" onClick={this.handleReload} className="btn">
              Recharger l'application
            </button>

            <Link to="/" className="btn">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
