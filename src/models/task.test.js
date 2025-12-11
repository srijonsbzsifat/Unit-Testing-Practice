/**
 * Task Model Unit Tests
 *
 * Tests for the Task Mongoose model including CRUD operations,
 * validation, and custom methods.
 *
 * Best Practice: Use descriptive test names that explain WHAT is being tested
 * and WHAT the expected outcome is.
 */

const mongoose = require('mongoose');
const Task = require('./task');
const dbHandler = require('../test-utils/db-handler');

let seedTaskId; // To store the ID of a specific seeded task for targeted testing

describe('Task Model Unit Tests', () => {
  // ===== Setup & Teardown =====

  /**
   * Connect to in-memory database before all tests
   * Best Practice: Use beforeAll for expensive operations that can be shared
   */
  beforeAll(async () => {
    await dbHandler.connect();
  });

  /**
   * Clear database between tests for isolation
   * Best Practice: Use beforeEach to ensure each test starts with a clean state
   */
  beforeEach(async () => {
    await dbHandler.clearDatabase();

    // Seed test data
    const taskA = await Task.create({ name: 'Seed Task A', completed: false });
    const taskB = await Task.create({ name: 'Seed Task B', completed: true });
    seedTaskId = taskB._id;
  });

  /**
   * Cleanup after all tests complete
   * Best Practice: Always cleanup resources to prevent memory leaks
   */
  afterAll(async () => {
    await dbHandler.disconnect();
  });

  // ===== CRUD Operation Tests =====

  describe('CRUD Operations', () => {
    test('should save a new task and persist it in the database', async () => {
      // Arrange
      const taskData = { name: 'New Task for Persistence Test' };

      // Act
      const savedTask = await Task.create(taskData);

      // Assert - verify returned object
      expect(savedTask.name).toBe(taskData.name);
      expect(savedTask.completed).toBe(false);
      expect(savedTask._id).toBeDefined();

      // Assert - verify database persistence
      const foundTask = await Task.findById(savedTask._id);
      expect(foundTask.name).toBe(taskData.name);
    });

    test('should retrieve a specific task by name', async () => {
      // Act
      const task = await Task.findOne({ name: 'Seed Task A' });

      // Assert
      expect(task).toBeDefined();
      expect(task.completed).toBe(false);
    });

    test('should retrieve a specific task by ID', async () => {
      // Act
      const task = await Task.findById(seedTaskId);

      // Assert
      expect(task).toBeDefined();
      expect(task.name).toBe('Seed Task B');
      expect(task.completed).toBe(true);
    });

    test('should update a task successfully', async () => {
      // Arrange
      const task = await Task.findById(seedTaskId);

      // Act
      task.name = 'Updated Task Name';
      await task.save();

      // Assert
      const updatedTask = await Task.findById(seedTaskId);
      expect(updatedTask.name).toBe('Updated Task Name');
    });

    test('should delete a task by ID', async () => {
      // Act
      await Task.deleteOne({ _id: seedTaskId });

      // Assert
      const foundTask = await Task.findById(seedTaskId);
      expect(foundTask).toBeNull();
    });
  });

  // ===== Validation Tests =====

  describe('Validation', () => {
    test('should reject creation if task name is missing', async () => {
      // Arrange
      const invalidTaskData = { completed: true };

      // Act & Assert
      await expect(Task.create(invalidTaskData)).rejects.toThrow(
        mongoose.Error.ValidationError
      );
      await expect(Task.create(invalidTaskData)).rejects.toThrow(
        'Task name is required.'
      );
    });

    test('should trim whitespace from task name', async () => {
      // Arrange
      const taskData = { name: '  Task with spaces  ' };

      // Act
      const task = await Task.create(taskData);

      // Assert
      expect(task.name).toBe('Task with spaces');
    });

    test('should reject empty task name', async () => {
      // Arrange
      const taskData = { name: '' };

      // Act & Assert
      await expect(Task.create(taskData)).rejects.toThrow(mongoose.Error.ValidationError);
      await expect(Task.create(taskData)).rejects.toThrow('Task name is required');
    });

    test('should reject task name exceeding 200 characters', async () => {
      // Arrange
      const longName = 'a'.repeat(201);
      const taskData = { name: longName };

      // Act & Assert
      await expect(Task.create(taskData)).rejects.toThrow(
        'Task name cannot exceed 200 characters.'
      );
    });

    test('should fail when attempting to find with malformed ID', async () => {
      // Arrange
      const malformedId = 'not-a-valid-id';

      // Act & Assert
      await expect(Task.findById(malformedId)).rejects.toThrow(
        mongoose.Error.CastError
      );
      await expect(Task.findById(malformedId)).rejects.toThrow(
        'Cast to ObjectId failed'
      );
    });
  });

  // ===== Instance Method Tests =====

  describe('Instance Methods', () => {
    test('should toggle completion status from false to true', async () => {
      // Arrange
      const task = await Task.findOne({ name: 'Seed Task A' });
      expect(task.completed).toBe(false);

      // Act
      await task.toggleCompletion();

      // Assert
      expect(task.completed).toBe(true);

      // Verify persistence
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.completed).toBe(true);
    });

    test('should toggle completion status from true to false', async () => {
      // Arrange
      const task = await Task.findOne({ name: 'Seed Task B' });
      expect(task.completed).toBe(true);

      // Act
      await task.toggleCompletion();

      // Assert
      expect(task.completed).toBe(false);
    });

    test('should correctly identify overdue incomplete tasks', async () => {
      // Arrange
      const task = await Task.findOne({ name: 'Seed Task A' });
      const pastDate = new Date('2020-01-01');

      // Act & Assert
      expect(task.isOverdue(pastDate)).toBe(true);
    });

    test('should not mark completed tasks as overdue', async () => {
      // Arrange
      const task = await Task.findOne({ name: 'Seed Task B' });
      const pastDate = new Date('2020-01-01');

      // Act & Assert
      expect(task.isOverdue(pastDate)).toBe(false);
    });

    test('should not mark tasks as overdue if due date is in future', async () => {
      // Arrange
      const task = await Task.findOne({ name: 'Seed Task A' });
      const futureDate = new Date('2030-01-01');

      // Act & Assert
      expect(task.isOverdue(futureDate)).toBe(false);
    });
  });

  // ===== Static Method Tests =====

  describe('Static Methods', () => {
    test('should find all completed tasks', async () => {
      // Arrange - add more completed tasks
      await Task.create({ name: 'Completed Task 1', completed: true });
      await Task.create({ name: 'Completed Task 2', completed: true });

      // Act
      const completedTasks = await Task.findCompleted();

      // Assert
      expect(completedTasks).toHaveLength(3); // 2 new + 1 seeded
      completedTasks.forEach((task) => {
        expect(task.completed).toBe(true);
      });
    });

    test('should find all pending tasks', async () => {
      // Arrange - add more pending tasks
      await Task.create({ name: 'Pending Task 1', completed: false });
      await Task.create({ name: 'Pending Task 2', completed: false });

      // Act
      const pendingTasks = await Task.findPending();

      // Assert
      expect(pendingTasks).toHaveLength(3); // 2 new + 1 seeded
      pendingTasks.forEach((task) => {
        expect(task.completed).toBe(false);
      });
    });

    test('should return empty array when no completed tasks exist', async () => {
      // Arrange - remove all completed tasks
      await Task.deleteMany({ completed: true });

      // Act
      const completedTasks = await Task.findCompleted();

      // Assert
      expect(completedTasks).toHaveLength(0);
    });
  });

  // ===== Timestamp Tests =====

  describe('Timestamps', () => {
    test('should automatically set createdAt timestamp', async () => {
      // Arrange & Act
      const task = await Task.create({ name: 'Timestamped Task' });

      // Assert
      expect(task.createdAt).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    test('should automatically set updatedAt timestamp', async () => {
      // Arrange
      const task = await Task.create({ name: 'Task to Update' });
      const originalUpdatedAt = task.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      task.name = 'Updated Name';
      await task.save();

      // Assert
      expect(task.updatedAt).toBeDefined();
      expect(task.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });
});
