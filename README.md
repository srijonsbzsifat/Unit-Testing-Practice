# Unit Testing Practice Project: Node.js, Mongoose & Jest

This project serves as a comprehensive practice environment for mastering essential unit testing techniques in a full-stack context. It features a simulated Node.js backend (Mongoose models) and a frontend data-fetching unit (Vue-style logic), with all external dependencies isolated using Jest.

## Key Goals

- **Isolation**: Keep units under test fully independent of any external system.
- **Asynchronous Testing**: Master Promises and async/await patterns in tests.
- **Mocking & Stubbing**: Control dependencies for reliable, side-effect-free unit tests.
- **State Management**: Use `mongodb-memory-server` to isolate database state for each test.

---

## Learning Objectives Covered

| Concept                         | Implementation Details                                                  |
|----------------------------------|------------------------------------------------------------------------|
| Unit Test Best Practices (AAA)   | All tests follow Arrange, Act, Assert structure.                        |
| Setup, Teardown, Isolation       | `src/tests/task.test.js` uses `beforeEach` (clear data) and `afterAll` (disconnect in-memory DB). |
| In-Memory MongoDB                | `src/tests/task.test.js` uses `mongodb-memory-server` for fast, isolated persistence testing. |
| Handling Async Errors            | Validates Mongoose `ValidationError` and `CastError` using `await expect(...).rejects.toThrow()`. |
| Mocking & Stubs                  | `src/frontend/tests/task_list.test.js` uses `jest.mock()` and `mockResolvedValue()` for API responses. |
| Scalability                      | Consistent `jest.clearAllMocks()` in `afterEach` for reliable, order-agnostic tests.               |

---

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Clone the Repository
```
git clone https://github.com/srijonsbzsifat/Unit-Testing-Practice.git
cd unit-testing-practice
```

### Install Dependencies
```
npm install
```

This command installs all required dependencies for development and testing, including `jest`, `mongodb-memory-server`, and `mongoose`.

---

## Running Unit Tests

To run all unit tests from your project root:
```
npm test
```

---

## Test Suite Structure

The test suite is organized into two primary areas:

### Backend Tests

- **File**: `src/tests/task.test.js`
- **Purpose**: Test the `Task` Mongoose Model.
  - Verifies CRUD operations (Create, Find, Delete) using an In-Memory MongoDB.
  - Tests for validation errors and casting errors from Mongoose.

### Frontend Logic Tests

- **File**: `src/frontend/tests/task_list.test.js`
- **Purpose**: Test the `loadTasks` frontend logic.
  - Transforms and loads raw API data.
  - Fully mocks backend dependencies using `jest.mock()`.
  - Uses stubs for various scenarios (success, empty results, errors).

---

## Best Practices Demonstrated

- Follows the **Arrange, Act, Assert (AAA)** test structure in every spec.
- Ensures complete test isolation using `mongodb-memory-server` and `jest.clearAllMocks()`.
- Handles async patterns and errors with `await`, `async`, and Jest's async assertion helpers.
- Demonstrates reliable and scalable test patterns for both backend (Mongoose) and frontend (Vue-style logic).

---

## File Overview

| File                                     | Description                                   |
|-------------------------------------------|-----------------------------------------------|
| `src/models/task.js`                      | Mongoose Model Definition                     |
| `src/tests/task.test.js`                  | Backend Model Unit Tests                      |
| `src/frontend/task_list.js`               | Frontend Data Logic (loadTasks)               |
| `src/frontend/tests/task_list.test.js`    | Frontend Logic Unit Tests (API mocking)       |

---

## License

This project is for educational use.
