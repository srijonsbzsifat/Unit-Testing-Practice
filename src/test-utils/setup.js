/**
 * Global Test Setup
 *
 * This file runs before all tests and sets up the test environment.
 * Best Practice: Centralize test setup for consistency across all test files.
 */

// Increase timeout for async operations in CI environments
if (process.env.CI) {
  jest.setTimeout(15000);
}

// Suppress console.error in tests unless debugging
// This keeps test output clean while allowing intentional error logging
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Allow errors that are part of the test (e.g., "Real API call initiated")
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Real API call initiated') ||
        args[0].includes('Should be mocked in unit tests'))
    ) {
      return;
    }
    // Log other errors normally in debug mode
    if (process.env.DEBUG) {
      originalError(...args);
    }
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities
global.testUtils = {
  /**
   * Creates a delay for testing async operations
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Generates mock task data for tests
   * @param {number} count - Number of tasks to generate
   * @param {boolean} completed - Whether tasks should be completed
   * @returns {Array<Object>}
   */
  generateMockTasks: (count, completed = false) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Task ${i + 1}`,
      completed,
    }));
  },
};
