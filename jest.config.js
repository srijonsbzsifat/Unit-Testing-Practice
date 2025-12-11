/**
 * Jest Configuration
 *
 * This centralized configuration ensures consistent test behavior across the project.
 * Best Practice: Keep all Jest settings in one place for maintainability.
 */

module.exports = {
  // Test environment - node for backend testing
  testEnvironment: 'node',

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/node_modules/**',
  ],

  // Coverage thresholds - enforce minimum code coverage
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Test match patterns - finds all .test.js files
  testMatch: [
    '**/src/**/*.test.js',
  ],

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.js'],

  // Verbose output for better debugging
  verbose: true,

  // Detect open handles (async operations that prevent Jest from exiting)
  detectOpenHandles: true,

  // Force exit after tests complete
  forceExit: true,

  // Timeout for tests (10 seconds)
  testTimeout: 10000,

  // Clear mocks between tests for isolation
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Reset modules between tests for better isolation
  resetModules: true,
};
