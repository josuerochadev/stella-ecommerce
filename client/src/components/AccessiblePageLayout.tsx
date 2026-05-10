import type React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface AccessiblePageLayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  skipToContent?: boolean;
  announcePageChange?: boolean;
}

const AccessiblePageLayout: React.FC<AccessiblePageLayoutProps> = ({
  title,
  children,
  className = "",
  skipToContent = true,
  announcePageChange = true,
}) => {
  const location = useLocation();

  // Update document title and announce page changes
  useEffect(() => {
    if (title) {
      document.title = `${title} - Stella`;
    }

    if (announcePageChange) {
      // Announce page change to screen readers
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.className = "sr-only";
      announcer.textContent = `Nouvelle page chargée: ${title || "Page"}`;

      document.body.appendChild(announcer);

      // Clean up after announcement
      setTimeout(() => {
        if (document.body.contains(announcer)) {
          document.body.removeChild(announcer);
        }
      }, 1000);
    }
  }, [title, announcePageChange]);

  // Reset focus to main content on route change
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent && skipToContent) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        mainContent.focus();
      }, 100);
    }
  }, [location.pathname, skipToContent]);

  return (
    <main
      id="main-content"
      className={`focus:outline-none ${className}`}
      tabIndex={-1}
      aria-label="Contenu principal"
    >
      {/* Page Title (visible) */}
      {title && (
        <div className="sr-only">
          <h1>{title}</h1>
        </div>
      )}

      {/* Page Content */}
      <div className="min-h-screen">{children}</div>
    </main>
  );
};

// Hook to manage page titles
export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - Stella`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

// Component for section headings with proper hierarchy
interface AccessibleSectionProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const AccessibleSection: React.FC<AccessibleSectionProps> = ({
  level,
  title,
  children,
  className = "",
  id,
}) => {
  const HeadingTag = `h${level}` as any;
  const sectionId =
    id ||
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  return (
    <section className={className} aria-labelledby={sectionId}>
      <HeadingTag
        id={sectionId}
        className={`
          ${level === 1 ? "text-4xl font-display mb-6" : ""}
          ${level === 2 ? "text-3xl font-display mb-4" : ""}
          ${level === 3 ? "text-2xl font-serif mb-3" : ""}
          ${level >= 4 ? "text-xl font-serif mb-2" : ""}
          text-text
        `}
      >
        {title}
      </HeadingTag>
      {children}
    </section>
  );
};

// Error message component with proper ARIA attributes
interface ErrorMessageProps {
  error: string | null;
  id?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  id = "error-message",
  className = "",
}) => {
  if (!error) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className={`p-4 bg-red-100 border border-red-300 text-red-800 rounded-md ${className}`}
    >
      <div className="flex items-center">
        <span className="mr-2" aria-hidden="true">
          ⚠️
        </span>
        <span>{error}</span>
      </div>
    </div>
  );
};

// Loading state component
interface LoadingStateProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  message = "Chargement en cours...",
  className = "",
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`flex items-center justify-center p-8 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex items-center space-x-3">
        <div
          className="motion-safe:animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"
          aria-hidden="true"
        />
        <span className="text-text font-medium">{message}</span>
      </div>
    </div>
  );
};

export default AccessiblePageLayout;
