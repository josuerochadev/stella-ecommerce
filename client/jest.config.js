/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest', // Utilisation de ts-jest pour TypeScript
  testEnvironment: 'jsdom', // jsdom pour simuler un navigateur dans les tests frontend
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Configuration supplémentaire pour React Testing Library
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }], // Support TypeScript avec ts-jest
  },
  modulePaths: ['<rootDir>/src'], // Facilite les imports relatifs
  testMatch: ['**/tests/**/*.(test|spec).[jt]s?(x)'], // Correspond aux fichiers de test
  collectCoverage: false, // Use --coverage flag to enable
  coverageDirectory: '<rootDir>/coverage', // Dossier de rapport de couverture
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/tests/**',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
};