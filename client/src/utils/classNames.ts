// client/src/utils/classNames.ts
// Utility functions for common Tailwind class combinations

/**
 * Common card styles
 */
export const cardClasses = {
  base: 'bg-secondary text-text rounded-lg shadow-lg',
  interactive: 'bg-secondary text-text rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer',
  compact: 'bg-secondary text-text rounded-md shadow-md p-4',
};

/**
 * Common button styles
 */
export const buttonClasses = {
  primary: 'btn',
  secondary: 'px-4 py-2 rounded-md bg-secondary text-text border border-primary hover:bg-primary transition-colors',
  danger: 'px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors',
};

/**
 * Form input styles
 */
export const inputClasses = {
  base: 'w-full p-3 rounded-md bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent',
  error: 'w-full p-3 rounded-md bg-primary text-text focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-500',
};

/**
 * Layout utilities
 */
export const layoutClasses = {
  container: 'container mx-auto px-4',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  grid: 'grid gap-4',
};

/**
 * Conditional class utility (similar to clsx but simpler)
 * @param classes Object with class names as keys and booleans as values
 * @returns Combined class string
 */
export const cn = (...classes: (string | false | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Conditional classes based on object
 * @param obj Object with className keys and boolean values
 * @returns Combined class string
 */
export const classNames = (obj: Record<string, boolean>): string => {
  return Object.entries(obj)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
};