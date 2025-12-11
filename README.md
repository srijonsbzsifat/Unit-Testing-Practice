# Unit Testing Practice Project: Node.js, Mongoose & Jest

This project serves as a comprehensive practice environment for mastering essential unit testing techniques in a full-stack context. It features a simulated Node.js backend (Mongoose models) and a frontend data-fetching unit (Vue-style logic), with all external dependencies isolated using Jest.

## Key Goals

- **Isolation**: Keep units under test fully independent of any external system
- **Asynchronous Testing**: Master Promises and async/await patterns in tests
- **Mocking & Stubbing**: Control dependencies for reliable, side-effect-free unit tests
- **State Management**: Use `mongodb-memory-server` to isolate database state for each test
- **Scalability**: Tests colocated with source code for easy maintenance and discoverability
- **Documentation**: Comprehensive JSDoc comments for better code understanding
- **Configuration Management**: Centralized configuration for flexibility and maintainability

---

## Learning Objectives Covered

| Concept                          | Implementation Details                                                                   |
|----------------------------------|------------------------------------------------------------------------------------------|
| Unit Test Best Practices (AAA)    | All tests follow Arrange, Act, Assert structure with clear comments                      |
| Setup, Teardown, Isolation        | Reusable DB handlers in `src/test-utils/db-handler.js` for consistent test setup         |
| In-Memory MongoDB                 | `mongodb-memory-server` for fast, isolated persistence testing                           |
| Handling Async Errors             | Validates errors using `await expect(...).rejects.toThrow()`                             |
| Mocking & Stubs                   | Centralized mock data in `src/test-utils/mock-helpers.js` for consistency                |
| API Testing with Mocked Fetch     | `src/frontend/services/api.test.js` mocks global `fetch` to test HTTP calls              |
| Test Utilities                    | Reusable test utilities and helpers to follow DRY principle                               |
| JSDoc Documentation               | Comprehensive function documentation with examples and type information                   |
| Configuration Management          | Separate config files (`src/config/`) for environment-specific settings                  |
| Descriptive Test Names            | Test names clearly describe WHAT is tested and WHAT the expected outcome is              |
| Test Organization                 | Nested `describe` blocks group related tests logically                                    |
| Code Coverage                     | Jest coverage reports with configurable thresholds                                        |

---

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

### Clone the Repository
```bash
git clone https://github.com/srijonsbzsifat/Unit-Testing-Practice.git
cd Unit-Testing-Practice
```

### Install Dependencies
```bash
npm install
```

This installs all required dependencies including `jest`, `mongodb-memory-server`, `mongoose`, `express`, and `vue`.

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Tests with Verbose Output
```bash
npm run test:verbose
```

### CI/CD Testing
```bash
npm run test:ci
```

### Test Statistics

- **Total Test Suites**: 3
- **Total Tests**: 40
- **Code Coverage**: ~75% overall
- **Test Breakdown**:
  - Backend Model Tests: 20 tests (CRUD, validation, instance methods, static methods, timestamps)
  - Frontend Logic Tests: 14 tests (data transformation, filtering, error handling)
  - API Service Tests: 6 tests (HTTP calls, error scenarios, response handling)

---

## Project Structure

```
Unit-Testing-Practice/
├── src/
│   ├── config/                      # Configuration files
│   │   └── api.config.js           # API endpoint configuration
│   │
│   ├── models/                      # Mongoose models
│   │   ├── task.js                 # Task model with instance/static methods
│   │   └── task.test.js            # Model tests (colocated)
│   │
│   ├── frontend/
│   │   ├── logic/                   # Business logic layer
│   │   │   ├── task_list.js        # Task list operations
│   │   │   └── task_list.test.js   # Logic tests (colocated)
│   │   │
│   │   └── services/                # API service layer
│   │       ├── api.js              # HTTP communication
│   │       └── api.test.js         # Service tests (colocated)
│   │
│   └── test-utils/                  # Shared test utilities
│       ├── setup.js                # Global test setup
│       ├── db-handler.js           # Database test utilities
│       └── mock-helpers.js         # Mock data and helpers
│
├── jest.config.js                   # Jest configuration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
└── package.json                     # Dependencies and scripts
```

---

## Best Practices Implemented

### 1. **Test Colocation**
Tests live alongside their source code using the `.test.js` naming convention:
- **Why**: Easier to find and maintain tests, scales better as project grows
- **Example**: `task.js` and `task.test.js` in the same directory

### 2. **Centralized Configuration**
Configuration extracted to separate files in `src/config/`:
- **Why**: Easier to manage environment-specific settings
- **Example**: API base URLs, timeouts, retry logic

### 3. **Reusable Test Utilities**
Common test logic extracted to `src/test-utils/`:
- **db-handler.js**: Database connection, cleanup, seeding
- **mock-helpers.js**: Mock data, mock factories, console spies
- **setup.js**: Global test environment configuration
- **Why**: DRY principle, consistency across tests, easier maintenance

### 4. **JSDoc Documentation**
Comprehensive function documentation with:
- Parameter types and descriptions
- Return types
- Usage examples
- Error conditions
- **Why**: Better IntelliSense, self-documenting code, easier onboarding

### 5. **Descriptive Test Names**
Test names follow the pattern: "should [expected behavior] when [condition]"
- **Good**: `should reject empty task name`
- **Bad**: `test 1`
- **Why**: Tests serve as living documentation

### 6. **Logical Test Organization**
Tests organized with nested `describe` blocks:
```javascript
describe('Task Model Unit Tests', () => {
  describe('CRUD Operations', () => {
    test('should save a new task...', () => {});
  });

  describe('Validation', () => {
    test('should reject invalid data...', () => {});
  });
});
```
- **Why**: Better test output, easier to find failing tests

### 7. **AAA Pattern (Arrange-Act-Assert)**
Every test follows this structure:
```javascript
test('should do something', () => {
  // Arrange: Set up test data
  const input = { name: 'Test' };

  // Act: Execute the functionality
  const result = doSomething(input);

  // Assert: Verify the outcome
  expect(result).toBe(expected);
});
```

### 8. **Test Isolation**
Each test is independent:
- Database cleared before each test (`beforeEach`)
- Mocks cleared after each test (`afterEach`)
- No shared mutable state between tests
- **Why**: Tests can run in any order, no flaky tests

### 9. **Error Handling Best Practices**
- Check `response.ok` before parsing JSON
- Await JSON parsing to catch errors
- Wrap errors with context: `Failed to fetch tasks: ${error.message}`
- **Why**: Better debugging, clearer error messages

### 10. **Input Validation**
Mongoose schema validation:
- Required fields with custom messages
- Min/max length constraints
- Trim whitespace
- Type checking
- **Why**: Fail fast with clear error messages

### 11. **Instance and Static Methods**
Task model includes:
- **Instance methods**: `toggleCompletion()`, `isOverdue()`
- **Static methods**: `findCompleted()`, `findPending()`
- **Why**: Encapsulates business logic in the model

### 12. **Coverage Thresholds**
Jest configured with minimum coverage requirements:
- 70% for branches, functions, lines, statements
- **Why**: Ensures adequate test coverage

---

## Test Suite Details

### Backend Model Tests (`src/models/task.test.js`)

Tests the Task Mongoose model with **20 tests** covering:

**CRUD Operations** (5 tests)
- Creating and persisting tasks
- Retrieving tasks by ID and criteria
- Updating task properties
- Deleting tasks

**Validation** (5 tests)
- Required field validation
- Whitespace trimming
- Length constraints
- Type validation
- Malformed ID handling

**Instance Methods** (5 tests)
- `toggleCompletion()` - Toggle task completion status
- `isOverdue()` - Check if task is overdue

**Static Methods** (3 tests)
- `findCompleted()` - Get all completed tasks
- `findPending()` - Get all pending tasks
- Empty result handling

**Timestamps** (2 tests)
- Automatic `createdAt` timestamp
- Automatic `updatedAt` timestamp

### Frontend Logic Tests (`src/frontend/logic/task_list.test.js`)

Tests business logic with **14 tests** covering:

**loadTasks Function** (9 tests)
- Successful API calls and data transformation
- Completion status handling (all completed, all pending, mixed)
- Empty response handling
- Error scenarios (network failure, 404, invalid format)
- Non-array response handling
- ID preservation during transformation

**filterTasksByStatus Function** (5 tests)
- Filtering by completion status
- Empty input handling
- No matches scenario
- Array immutability verification

### API Service Tests (`src/frontend/services/api.test.js`)

Tests HTTP communication with **6 tests** covering:

- Successful API calls and JSON parsing
- Network failure handling
- Non-200 HTTP status codes (404, 500)
- Invalid JSON responses
- Empty array responses
- Console warning verification

---

## Configuration Files

### jest.config.js
Centralized Jest configuration including:
- Test environment settings
- Coverage configuration and thresholds
- Test file patterns
- Global setup files
- Timeout settings
- Mock behavior

### .env.example
Template for environment variables:
- API configuration (base URL, timeout)
- MongoDB connection string
- Debug flags
- CI/CD settings

---

## Key Takeaways

1. **Tests are First-Class Citizens**: Colocated with source code, well-documented, and maintained
2. **Reusability**: Shared utilities reduce duplication and ensure consistency
3. **Clarity**: Descriptive names, comments, and organization make tests self-documenting
4. **Reliability**: Proper isolation and cleanup prevent flaky tests
5. **Maintainability**: Centralized configuration and utilities make changes easier
6. **Professional Standards**: Follows industry best practices for testing and documentation

---

## License

This project is for educational purposes.

---

## Contributing

This is a learning project, but suggestions and improvements are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Ensure all tests pass
5. Submit a pull request

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Testing Best Practices](https://testingjavascript.com/)
- [JSDoc Documentation](https://jsdoc.app/)
