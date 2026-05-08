import { forwardRef, useId } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  isRequired?: boolean;
  showRequiredIndicator?: boolean;
  variant?: "default" | "search";
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      description,
      isRequired = false,
      showRequiredIndicator = true,
      variant = "default",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const descriptionId = description ? `${inputId}-description` : undefined;

    const baseClasses = {
      default:
        "w-full p-3 rounded-md bg-surface-2 text-text border-2 border-transparent focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,179,71,0.15)] transition-all duration-200",
      search:
        "w-full p-2 rounded-md bg-surface-1 text-text focus:outline-none focus:ring-2 focus:ring-accent border border-text/10",
    };

    const inputClasses = `
    ${baseClasses[variant]}
    ${error ? "border-red-500 focus:ring-red-500" : ""}
    ${className}
  `.trim();

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-serif text-text">
            {label}
            {isRequired && showRequiredIndicator && (
              <span aria-label="champ requis" className="text-red-500 ml-1">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          required={isRequired}
          aria-required={isRequired}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          {...props}
        />

        {description && (
          <div id={descriptionId} className="text-sm text-text/70">
            {description}
          </div>
        )}

        {error && (
          <div id={errorId} className="text-sm text-red-500" role="alert" aria-live="polite">
            {error}
          </div>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
