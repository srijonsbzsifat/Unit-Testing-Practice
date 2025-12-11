/**
 * Task List Logic Unit Tests
 *
 * Tests for frontend business logic including API integration and data transformation.
 *
 * Best Practice: Mock external dependencies (API calls) to keep tests fast,
 * reliable, and isolated from network conditions.
 */

const { loadTasks, filterTasksByStatus } = require('./task_list');
const api = require('../services/api');
const { mockTasks, mockErrors } = require('../../test-utils/mock-helpers');

// Mock the API module
jest.mock('../services/api');

describe('Task List Logic', () => {
  /**
   * Clear all mocks after each test for isolation
   * Best Practice: Prevent test pollution by resetting mocks between tests
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===== loadTasks Tests =====

  describe('loadTasks', () => {
    test('should format tasks correctly on successful API call', async () => {
      // Arrange
      api.getTasks.mockResolvedValue(mockTasks.standard);

      // Act
      const result = await loadTasks();

      // Assert - verify API was called
      expect(api.getTasks).toHaveBeenCalledTimes(1);

      // Assert - verify successful response structure
      expect(result.error).toBeNull();
      expect(result.tasks).toHaveLength(3);

      // Assert - verify data transformation
      expect(result.tasks[0].display).toBe('Finish mocking guide (DONE)');
      expect(result.tasks[0].status).toBe('Success');
      expect(result.tasks[1].display).toBe('Write documentation');
      expect(result.tasks[1].status).toBe('Pending');
    });

    test('should correctly mark all tasks as Success if all are completed', async () => {
      // Arrange
      api.getTasks.mockResolvedValue(mockTasks.allCompleted);

      // Act
      const result = await loadTasks();

      // Assert
      expect(api.getTasks).toHaveBeenCalledTimes(1);
      expect(result.tasks).toHaveLength(2);

      // Verify all tasks have Success status
      result.tasks.forEach((task) => {
        expect(task.status).toBe('Success');
        expect(task.display).toContain('(DONE)');
      });
    });

    test('should correctly mark all tasks as Pending if none are completed', async () => {
      // Arrange
      api.getTasks.mockResolvedValue(mockTasks.allPending);

      // Act
      const result = await loadTasks();

      // Assert
      expect(result.tasks).toHaveLength(2);

      // Verify all tasks have Pending status
      result.tasks.forEach((task) => {
        expect(task.status).toBe('Pending');
        expect(task.display).not.toContain('(DONE)');
      });
    });

    test('should handle empty task list from API', async () => {
      // Arrange
      api.getTasks.mockResolvedValue(mockTasks.empty);

      // Act
      const result = await loadTasks();

      // Assert
      expect(result.error).toBeNull();
      expect(result.tasks).toHaveLength(0);
      expect(result.tasks).toEqual([]);
    });

    test('should return error message on network failure', async () => {
      // Arrange
      api.getTasks.mockRejectedValue(mockErrors.network);

      // Act
      const result = await loadTasks();

      // Assert
      expect(api.getTasks).toHaveBeenCalledTimes(1);
      expect(result.tasks).toHaveLength(0);
      expect(result.error).toBe('Failed to load tasks from server.');
    });

    test('should return same error message on 404 API error', async () => {
      // Arrange
      api.getTasks.mockRejectedValue(mockErrors.notFound);

      // Act
      const result = await loadTasks();

      // Assert
      expect(result.tasks).toHaveLength(0);
      expect(result.error).toBe('Failed to load tasks from server.');
    });

    test('should return error when API returns non-array response', async () => {
      // Arrange - API returns an object instead of array
      api.getTasks.mockResolvedValue({ tasks: [] });

      // Act
      const result = await loadTasks();

      // Assert
      expect(result.tasks).toHaveLength(0);
      expect(result.error).toBe('Invalid response format: expected array of tasks.');
    });

    test('should return error when API returns null', async () => {
      // Arrange
      api.getTasks.mockResolvedValue(null);

      // Act
      const result = await loadTasks();

      // Assert
      expect(result.tasks).toHaveLength(0);
      expect(result.error).toBe('Invalid response format: expected array of tasks.');
    });

    test('should preserve task IDs during transformation', async () => {
      // Arrange
      const tasksWithIds = [
        { id: 101, name: 'Task 101', completed: false },
        { id: 202, name: 'Task 202', completed: true },
      ];
      api.getTasks.mockResolvedValue(tasksWithIds);

      // Act
      const result = await loadTasks();

      // Assert
      expect(result.tasks[0].id).toBe(101);
      expect(result.tasks[1].id).toBe(202);
    });
  });

  // ===== filterTasksByStatus Tests =====

  describe('filterTasksByStatus', () => {
    const mixedTasks = [
      { id: 1, display: 'Task 1 (DONE)', status: 'Success' },
      { id: 2, display: 'Task 2', status: 'Pending' },
      { id: 3, display: 'Task 3 (DONE)', status: 'Success' },
      { id: 4, display: 'Task 4', status: 'Pending' },
    ];

    test('should filter and return only completed tasks', () => {
      // Act
      const completedTasks = filterTasksByStatus(mixedTasks, true);

      // Assert
      expect(completedTasks).toHaveLength(2);
      completedTasks.forEach((task) => {
        expect(task.status).toBe('Success');
      });
    });

    test('should filter and return only pending tasks', () => {
      // Act
      const pendingTasks = filterTasksByStatus(mixedTasks, false);

      // Assert
      expect(pendingTasks).toHaveLength(2);
      pendingTasks.forEach((task) => {
        expect(task.status).toBe('Pending');
      });
    });

    test('should return empty array when no tasks match filter', () => {
      // Arrange - all tasks are completed
      const allCompletedTasks = [
        { id: 1, display: 'Task 1 (DONE)', status: 'Success' },
        { id: 2, display: 'Task 2 (DONE)', status: 'Success' },
      ];

      // Act - filter for pending tasks
      const result = filterTasksByStatus(allCompletedTasks, false);

      // Assert
      expect(result).toHaveLength(0);
    });

    test('should return empty array when given empty input', () => {
      // Act
      const result = filterTasksByStatus([], true);

      // Assert
      expect(result).toHaveLength(0);
    });

    test('should not mutate original array', () => {
      // Arrange
      const originalTasks = [...mixedTasks];

      // Act
      filterTasksByStatus(mixedTasks, true);

      // Assert
      expect(mixedTasks).toEqual(originalTasks);
      expect(mixedTasks.length).toBe(4);
    });
  });
});
