// Composants UI réutilisables pour réduire la duplication de code

export { default as Button } from "@/components/Button";
export { default as FormInput } from "@/components/FormInput";
export { default as FormContainer } from "@/components/FormContainer";
export { default as CollectionButton } from "@/components/CollectionButton";
export { default as AccessibleModal } from "@/components/AccessibleModal";
export { default as StatusMessage } from "@/components/StatusMessage";
export { default as SkipLinks } from "@/components/SkipLinks";

// Hooks utilitaires
export { useApiCall, useCollectionOperation, useValidatedApiCall } from "@/hooks/useApiCall";
export { useFocusTrap, useKeyboardNavigation, useFormAnnouncements } from "@/hooks/useFocusManagement";

// Types
export type { default as StatusMessageProps } from "@/components/StatusMessage";