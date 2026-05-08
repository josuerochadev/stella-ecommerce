import { forwardRef } from "react";

interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  error?: string;
  isLoading?: boolean;
  variant?: "default" | "compact";
  children: React.ReactNode;
}

const FormContainer = forwardRef<HTMLFormElement, FormContainerProps>(
  (
    {
      title,
      description,
      error,
      isLoading = false,
      variant = "default",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = {
      default: "space-y-4 bg-secondary text-text p-6 rounded-md shadow-lg",
      compact: "space-y-3 bg-secondary text-text p-4 rounded-md shadow-md",
    };

    const formClasses = `${baseClasses[variant]} ${className}`.trim();

    return (
      <div className="w-full max-w-md mx-auto">
        {title && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display text-text mb-2">{title}</h2>
            {description && <p className="text-text/70">{description}</p>}
          </div>
        )}

        {error && (
          <div
            className="mb-4 p-3 bg-red-900/90 border border-red-500 text-red-100 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form ref={ref} className={formClasses} noValidate {...props}>
          {isLoading && (
            <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full" />
                <span className="text-text">Chargement...</span>
              </div>
            </div>
          )}
          {children}
        </form>
      </div>
    );
  },
);

FormContainer.displayName = "FormContainer";

export default FormContainer;
