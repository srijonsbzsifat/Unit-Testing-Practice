/**
 * Mock Helpers for Testing
 *
 * Reusable mock data and helper functions for consistent test mocking.
 * Best Practice: Centralize mock data to ensure consistency across tests
 * and make updates easier when data structures change.
 */

/**
 * Standard mock task responses
 */
const mockTasks = {
  // Mixed completion status
  standard: [
    { id: 1, name: 'Finish mocking guide', completed: true },
    { id: 2, name: 'Write documentation', completed: false },
    { id: 3, name: 'Review PR', completed: false },
  ],

  // All completed
  allCompleted: [
    { id: 1, name: 'Task 1', completed: true },
    { id: 2, name: 'Task 2', completed: true },
  ],

  // All pending
  allPending: [
    { id: 1, name: 'Task 1', completed: false },
    { id: 2, name: 'Task 2', completed: false },
  ],

  // Empty array
  empty: [],

  // Single task
  single: [{ id: 1, name: 'Single Task', completed: false }],
};

/**
 * Standard error mocks
 */
const mockErrors = {
  network: new Error('Network request failed'),
  timeout: new Error('Request timeout'),
  notFound: new Error('404 Not Found: Resource not available'),
  serverError: new Error('500 Internal Server Error'),
  unauthorized: new Error('401 Unauthorized'),
  invalidJson: new Error('Unexpected token < in JSON'),
};

/**
 * Creates a mock fetch response
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @param {boolean} ok - Response ok status
 * @returns {Object} Mock fetch response
 */
const createMockResponse = (data, status = 200, ok = true) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Error',
  json: jest.fn().mockResolvedValue(data),
  text: jest.fn().mockResolvedValue(JSON.stringify(data)),
});

/**
 * Creates a mock fetch that rejects with an error
 * @param {Error} error - Error to reject with
 * @returns {Function} Mock fetch function
 */
const createMockRejection = (error) => {
  return jest.fn().mockRejectedValue(error);
};

/**
 * Spy on console methods without polluting test output
 * @param {string} method - Console method to spy on ('log', 'error', 'warn')
 * @returns {jest.SpyInstance} Jest spy instance
 */
const spyOnConsole = (method = 'error') => {
  return jest.spyOn(console, method).mockImplementation(() => {});
};

/**
 * Restores all console spies
 * @param {Array<jest.SpyInstance>} spies - Array of console spies to restore
 */
const restoreConsoleSpy = (...spies) => {
  spies.forEach((spy) => spy.mockRestore());
};

module.exports = {
  mockTasks,
  mockErrors,
  createMockResponse,
  createMockRejection,
  spyOnConsole,
  restoreConsoleSpy,
};
