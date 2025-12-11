/**
 * Task Model
 *
 * Mongoose model for Task documents.
 * Best Practice: Keep models focused on data structure and simple instance methods.
 * Complex business logic should be in separate service layers.
 */

const mongoose = require('mongoose');

/**
 * Task Schema Definition
 */
const taskSchema = new mongoose.Schema(
  {
    /**
     * Task name/description
     * @type {string}
     */
    name: {
      type: String,
      required: [true, 'Task name is required.'],
      trim: true,
      minlength: [1, 'Task name cannot be empty.'],
      maxlength: [200, 'Task name cannot exceed 200 characters.'],
    },

    /**
     * Task completion status
     * @type {boolean}
     */
    completed: {
      type: Boolean,
      default: false,
    },

    /**
     * Task creation timestamp
     * @type {Date}
     */
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Best Practice: Enable timestamps for audit trail
    timestamps: true,
  }
);

// ===== Instance Methods =====

/**
 * Toggles the completion status of the task
 *
 * @returns {Promise<Task>} Updated task
 *
 * @example
 * const task = await Task.findById(id);
 * await task.toggleCompletion();
 */
taskSchema.methods.toggleCompletion = async function () {
  this.completed = !this.completed;
  return this.save();
};

/**
 * Checks if the task is overdue (for future enhancement)
 *
 * @param {Date} dueDate - Due date to check against
 * @returns {boolean} True if task is overdue and not completed
 *
 * @example
 * const isOverdue = task.isOverdue(new Date('2024-01-01'));
 */
taskSchema.methods.isOverdue = function (dueDate) {
  if (this.completed) return false;
  return new Date() > dueDate;
};

// ===== Static Methods =====

/**
 * Finds all completed tasks
 *
 * @returns {Promise<Task[]>} Array of completed tasks
 *
 * @example
 * const completedTasks = await Task.findCompleted();
 */
taskSchema.statics.findCompleted = function () {
  return this.find({ completed: true });
};

/**
 * Finds all pending tasks
 *
 * @returns {Promise<Task[]>} Array of pending tasks
 *
 * @example
 * const pendingTasks = await Task.findPending();
 */
taskSchema.statics.findPending = function () {
  return this.find({ completed: false });
};

// ===== Model Creation =====

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
