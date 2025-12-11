/**
 * Task List Logic Module
 *
 * Business logic for handling task list operations in the frontend.
 * Best Practice: Separate business logic from UI components for better
 * testability and reusability.
 */

const api = require('../services/api');

/**
 * Task display format
 * @typedef {Object} FormattedTask
 * @property {number} id - Task ID
 * @property {string} display - Formatted display string
 * @property {string} status - Task status ('Success' or 'Pending')
 */

/**
 * Task load result
 * @typedef {Object} TaskLoadResult
 * @property {FormattedTask[]} tasks - Array of formatted tasks
 * @property {string|null} error - Error message if load failed, null otherwise
 */

/**
 * Loads tasks from the API and formats them for display
 *
 * This function handles the complete flow of fetching tasks from the API,
 * transforming them into a display-friendly format, and handling any errors
 * that occur during the process.
 *
 * Best Practice: Keep business logic pure and testable by separating
 * data fetching from data transformation.
 *
 * @returns {Promise<TaskLoadResult>} Result object with tasks and error
 *
 * @example
 * const result = await loadTasks();
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.tasks);
 * }
 */
exports.loadTasks = async () => {
  try {
    const rawTasks = await api.getTasks();

    // Validate that we received an array
    if (!Array.isArray(rawTasks)) {
      return {
        tasks: [],
        error: 'Invalid response format: expected array of tasks.',
      };
    }

    // Transform raw API data into display format
    const formattedTasks = rawTasks.map((task) => ({
      id: task.id,
      display: task.name + (task.completed ? ' (DONE)' : ''),
      status: task.completed ? 'Success' : 'Pending',
    }));

    return { tasks: formattedTasks, error: null };
  } catch (err) {
    // Best Practice: Log errors for debugging but return user-friendly messages
    console.error('Error loading tasks:', err);
    return {
      tasks: [],
      error: 'Failed to load tasks from server.',
    };
  }
};

/**
 * Filters tasks by completion status
 *
 * @param {FormattedTask[]} tasks - Array of formatted tasks
 * @param {boolean} completed - Filter for completed (true) or pending (false) tasks
 * @returns {FormattedTask[]} Filtered tasks
 *
 * @example
 * const completedTasks = filterTasksByStatus(allTasks, true);
 */
exports.filterTasksByStatus = (tasks, completed) => {
  const statusFilter = completed ? 'Success' : 'Pending';
  return tasks.filter((task) => task.status === statusFilter);
};
