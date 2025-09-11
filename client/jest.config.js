/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest', // Utilisation de ts-jest pour TypeScript
  testEnvironment: 'jsdom', // jsdom pour simuler un navigateur dans les tests frontend
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Configuration supplémentaire pour React Testing Library
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Gère les imports CSS
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }], // Support TypeScript avec ts-jest
  },
  modulePaths: ['<rootDir>/src'], // Facilite les imports relatifs
  testMatch: ['**/tests/**/*.(test|spec).[jt]s?(x)'], // Correspond aux fichiers de test
  collectCoverage: true, // Active la collecte de couverture
  coverageDirectory: '<rootDir>/coverage', // Dossier de rapport de couverture
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Fichiers source pour la couverture
    '!src/**/*.d.ts', // Exclusion des fichiers de définition de type
    '!src/index.tsx', // Exclusion du fichier d'entrée principal
  ],
};