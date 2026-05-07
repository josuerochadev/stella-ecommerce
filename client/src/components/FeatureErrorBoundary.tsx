import { logger } from "@/utils/logger";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  featureName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error Boundary locale par feature.
 * Isole les erreurs d'un composant sans crasher toute l'app.
 */
class FeatureErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      `Error in ${this.props.featureName}:`,
      { message: error.message, stack: errorInfo.componentStack },
      "FeatureErrorBoundary",
    );
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-secondary/50 text-text p-6 rounded-lg text-center">
          <p className="text-lg font-serif mb-2">Impossible de charger {this.props.featureName}.</p>
          <button
            type="button"
            className="btn text-sm"
            onClick={() => this.setState({ hasError: false })}
          >
            Reessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FeatureErrorBoundary;
