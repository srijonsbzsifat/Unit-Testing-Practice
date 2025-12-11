# Unit Testing Practice Project: Node.js, Mongoose & Jest

This project serves as a comprehensive practice environment for mastering essential unit testing techniques in a full-stack context. It features a simulated Node.js backend (Mongoose models) and a frontend data-fetching unit (Vue-style logic), with all external dependencies isolated using Jest.

## Key Goals

- **Isolation**: Keep units under test fully independent of any external system.
- **Asynchronous Testing**: Master Promises and async/await patterns in tests.
- **Mocking & Stubbing**: Control dependencies for reliable, side-effect-free unit tests.
- **State Management**: Use `mongodb-memory-server` to isolate database state for each test.
- **Scalability**: Tests are colocated with source code for easy maintenance and discoverability.

---

## Learning Objectives Covered

| Concept                         | Implementation Details                                                  |
|----------------------------------|------------------------------------------------------------------------|
| Unit Test Best Practices (AAA)   | All tests follow Arrange, Act, Assert structure.                        |
| Setup, Teardown, Isolation       | `src/models/task.test.js` uses `beforeEach` (clear data) and `afterAll` (disconnect in-memory DB). |
| In-Memory MongoDB                | `src/models/task.test.js` uses `mongodb-memory-server` for fast, isolated persistence testing. |
| Handling Async Errors            | Validates Mongoose `ValidationError` and `CastError` using `await expect(...).rejects.toThrow()`. |
| Mocking & Stubs                  | `src/frontend/logic/task_list.test.js` uses `jest.mock()` and `mockResolvedValue()` for API responses. |
| API Testing with Mocked Fetch    | `src/frontend/services/api.test.js` mocks global `fetch` to test HTTP calls and error scenarios. |
| Scalability                      | Tests colocated with source code; Consistent `jest.clearAllMocks()` in `afterEach` for reliable tests. |

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

### Test Statistics

- **Total Test Suites**: 3
- **Total Tests**: 15
- **Coverage**:
  - Backend Model Tests: 5 tests
  - Frontend Logic Tests: 4 tests
  - API Service Tests: 6 tests

All tests are designed to be meaningful and verify actual behavior rather than arbitrary assertions.

---

## Test Suite Structure

Tests are colocated with their corresponding source files for better maintainability and scalability. The test suite is organized into three primary areas:

### Backend Model Tests

- **File**: `src/models/task.test.js` (colocated with `task.js`)
- **Purpose**: Test the `Task` Mongoose Model.
  - Verifies CRUD operations (Create, Find, Delete) using an In-Memory MongoDB.
  - Tests for validation errors and casting errors from Mongoose.
  - Uses `beforeEach` for data isolation and `afterAll` for cleanup.

### Frontend Logic Tests

- **File**: `src/frontend/logic/task_list.test.js` (colocated with `task_list.js`)
- **Purpose**: Test the `loadTasks` frontend logic.
  - Transforms and loads raw API data.
  - Fully mocks backend dependencies using `jest.mock()`.
  - Uses stubs for various scenarios (success, empty results, errors).

### API Service Tests

- **File**: `src/frontend/services/api.test.js` (colocated with `api.js`)
- **Purpose**: Test the `getTasks` API service.
  - Mocks global `fetch` to avoid real HTTP calls.
  - Tests successful API calls and JSON parsing.
  - Validates error handling for network failures, invalid JSON, and non-200 responses.
  - Verifies console warning messages.

---

## Best Practices Demonstrated

- Follows the **Arrange, Act, Assert (AAA)** test structure in every spec.
- Ensures complete test isolation using `mongodb-memory-server` and `jest.clearAllMocks()`.
- Handles async patterns and errors with `await`, `async`, and Jest's async assertion helpers.
- **Colocates tests with source code** for improved maintainability and scalability.
- Demonstrates comprehensive testing patterns for models, business logic, and API services.
- Uses meaningful test cases that verify actual behavior rather than arbitrary assertions.

---

## File Overview

Tests are colocated with their source files using the `.test.js` naming convention:

| File                                          | Description                                   |
|-----------------------------------------------|-----------------------------------------------|
| `src/models/task.js`                          | Mongoose Model Definition                     |
| `src/models/task.test.js`                     | Backend Model Unit Tests (colocated)          |
| `src/frontend/logic/task_list.js`             | Frontend Data Logic (loadTasks)               |
| `src/frontend/logic/task_list.test.js`        | Frontend Logic Unit Tests (colocated)         |
| `src/frontend/services/api.js`                | API Service (getTasks)                        |
| `src/frontend/services/api.test.js`           | API Service Unit Tests (colocated)            |

### Project Structure

```
src/
├── models/
│   ├── task.js                    # Mongoose model
│   └── task.test.js               # Model tests
└── frontend/
    ├── logic/
    │   ├── task_list.js           # Business logic
    │   └── task_list.test.js      # Logic tests
    └── services/
        ├── api.js                 # API service
        └── api.test.js            # Service tests
```

---

## License

This project is for educational use.
