// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  // Configuración de coverage
  collectCoverage: false, // Solo cuando se ejecute con --coverage
  collectCoverageFrom: [
    'components/**/*.{js,jsx}',
    'app/**/*.{js,jsx}',
    '!**/*.test.{js,jsx}',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 35,
      lines: 40,
      statements: 40,
    },
  },
}

module.exports = createJestConfig(customJestConfig)