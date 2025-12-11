/**
 * API Configuration
 *
 * Centralized configuration for API endpoints and settings.
 * Best Practice: Extract configuration to separate files for easier maintenance
 * and environment-specific overrides.
 */

module.exports = {
  // Base URL for API calls
  // In production, this would come from environment variables
  BASE_URL: process.env.API_BASE_URL || 'http://api.myapp.com/tasks',

  // Timeout for API requests (milliseconds)
  TIMEOUT: process.env.API_TIMEOUT || 5000,

  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // API endpoints
  ENDPOINTS: {
    TASKS: '/tasks',
    TASK_BY_ID: (id) => `/tasks/${id}`,
    CREATE_TASK: '/tasks',
    UPDATE_TASK: (id) => `/tasks/${id}`,
    DELETE_TASK: (id) => `/tasks/${id}`,
  },
};
