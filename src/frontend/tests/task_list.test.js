// Import the unit under test
const { loadTasks } = require('../logic/task_list');

// Import the dependency to be mocked
const api = require('../services/api');

// Mock the external dependency module
jest.mock('../services/api');

// 1. Stubs: Define reusable test variables/mock data
const MOCK_SUCCESS_RESPONSE = [
    { id: 1, name: 'Finish mocking guide', completed: true },
    { id: 2, name: 'Write documentation', completed: false }
];

const MOCK_ALL_COMPLETE_RESPONSE = [ 
    { id: 3, name: 'Task 3', completed: true },
    { id: 4, name: 'Task 4', completed: true }
];

// Define different error types to simulate different API failures
const MOCK_NETWORK_ERROR = new Error('Network timeout or connection refused');
const MOCK_API_404_ERROR = new Error('404 Not Found: Resource not available'); 

// --- Mocking & Stubs for Asynchronous Logic ---
describe('Task List Logic (Mocking & Stubs) - Asynchronous Tests', () => {

    // 2. Clear Mocks: Best practice to reset call counts before each test
    afterEach(() => {
        // Clears api.getTasks.mock.calls, ensuring tests are isolated
        jest.clearAllMocks(); 
    });

    // Test Case 1: Standard success and data transformation
    test('should format tasks correctly on successful API call (Mocking/Stubs)', async () => {
        // Arrange: Stub the mocked function to return successful data
        api.getTasks.mockResolvedValue(MOCK_SUCCESS_RESPONSE);

        // Act (Async)
        const result = await loadTasks();

        // Assert: Verify the mocked dependency was called (ensures isolation)
        expect(api.getTasks).toHaveBeenCalledTimes(1);

        // Assert: Verify the unit under test correctly processed the stubbed data
        expect(result.error).toBeNull();
        expect(result.tasks).toHaveLength(2);
        // Verify output structure based on stubbed data
        expect(result.tasks[0].display).toBe('Finish mocking guide (DONE)');
        expect(result.tasks[1].status).toBe('Pending');
    });
    
    // Test Case 2: Scenario testing using different stub data
    test('should correctly mark all tasks as "Success" if API returns all completed', async () => {
        // Arrange: Stub with the MOCK_ALL_COMPLETE_RESPONSE
        api.getTasks.mockResolvedValue(MOCK_ALL_COMPLETE_RESPONSE);

        // Act (Async)
        const result = await loadTasks();

        // Assert
        expect(api.getTasks).toHaveBeenCalledTimes(1);
        expect(result.tasks).toHaveLength(2);
        // Check that the transformation logic handled the 'completed: true' flag
        expect(result.tasks[0].status).toBe('Success');
        expect(result.tasks[1].status).toBe('Success');
        expect(result.tasks[0].display).toContain('(DONE)');
    });

    // Test Case 3: Handling Generic Network Failure (Existing test, using MOCK_NETWORK_ERROR)
    test('should return a generic error message on network failure', async () => {
        // Arrange: Stub the mocked function to simulate a rejected promise (Network error)
        api.getTasks.mockRejectedValue(MOCK_NETWORK_ERROR);

        // Act (Async)
        const result = await loadTasks();

        // Assert
        expect(api.getTasks).toHaveBeenCalledTimes(1);
        expect(result.tasks).toHaveLength(0);
        // Note: The logic currently returns a static error message regardless of the source
        expect(result.error).toBe('Failed to load tasks from server.');
    });

    // Test Case 4: Handling Specific API Failure (New test, using MOCK_API_404_ERROR)
    test('should return the same generic error message on a 404 API error', async () => {
        // Arrange: Stub the mocked function to simulate a rejected promise (API 404 error)
        api.getTasks.mockRejectedValue(MOCK_API_404_ERROR);

        // Act (Async)
        const result = await loadTasks();

        // Assert
        expect(api.getTasks).toHaveBeenCalledTimes(1);
        expect(result.tasks).toHaveLength(0);
        // Assertion remains the same because the loadTasks catch block is generic
        expect(result.error).toBe('Failed to load tasks from server.');
    });
});
