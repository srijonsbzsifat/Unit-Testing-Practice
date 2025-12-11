/**
 * API Service Module
 *
 * Handles all HTTP communication with the backend API.
 * Best Practice: Centralize API calls in a service layer for better
 * separation of concerns and easier testing/mocking.
 */

const apiConfig = require('../../config/api.config');

/**
 * Fetches all tasks from the API
 *
 * @returns {Promise<Array<Object>>} Array of task objects
 * @throws {Error} When the API request fails
 *
 * @example
 * const tasks = await getTasks();
 * // Returns: [{ id: 1, name: 'Task 1', completed: false }, ...]
 */
exports.getTasks = async () => {
  // In a real app, this would use fetch or axios.
  console.error('Real API call initiated. Should be mocked in unit tests.');

  try {
    const response = await fetch(apiConfig.BASE_URL);

    // Best Practice: Check response status before parsing
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Await JSON parsing to catch parsing errors in try-catch
    return await response.json();
  } catch (error) {
    // Best Practice: Provide context in error messages
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
};

/**
 * Creates a new task via the API
 *
 * @param {Object} taskData - Task data to create
 * @param {string} taskData.name - Task name
 * @param {boolean} [taskData.completed=false] - Task completion status
 * @returns {Promise<Object>} Created task object
 * @throws {Error} When the API request fails
 */
exports.createTask = async (taskData) => {
  try {
    const response = await fetch(apiConfig.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Await JSON parsing to catch parsing errors in try-catch
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
};
