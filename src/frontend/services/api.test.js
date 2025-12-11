// Import the service under test
const api = require('./api');

// Mock the global fetch function
global.fetch = jest.fn();

// Test data constants
const MOCK_TASKS_RESPONSE = [
    { id: 1, name: 'Task 1', completed: false },
    { id: 2, name: 'Task 2', completed: true }
];

const BASE_URL = 'http://api.myapp.com/tasks';

describe('API Service - getTasks', () => {

    // Reset mocks before each test to ensure test isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case 1: Successful API call with valid JSON response
    test('should successfully fetch and return tasks from API', async () => {
        // Arrange: Mock a successful fetch response
        const mockResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(MOCK_TASKS_RESPONSE)
        };
        global.fetch.mockResolvedValue(mockResponse);

        // Act
        const result = await api.getTasks();

        // Assert: Verify fetch was called with correct URL
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(BASE_URL);

        // Assert: Verify response data was parsed correctly
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(result).toEqual(MOCK_TASKS_RESPONSE);
    });

    // Test Case 2: Network failure (fetch throws error)
    test('should throw error when network request fails', async () => {
        // Arrange: Mock fetch to simulate network failure
        const networkError = new Error('Network request failed');
        global.fetch.mockRejectedValue(networkError);

        // Act & Assert: Expect the function to throw
        await expect(api.getTasks()).rejects.toThrow('Network request failed');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Test Case 3: API returns non-200 status (e.g., 404, 500)
    test('should throw error for non-200 HTTP responses', async () => {
        // Arrange: Mock a 404 response
        const mockResponse = {
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: jest.fn().mockResolvedValue({ error: 'Not Found' })
        };
        global.fetch.mockResolvedValue(mockResponse);

        // Act & Assert: Should throw error for non-200 status
        await expect(api.getTasks()).rejects.toThrow('HTTP 404: Not Found');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Test Case 4: API returns invalid JSON
    test('should throw error when response JSON parsing fails', async () => {
        // Arrange: Mock response with invalid JSON
        const jsonError = new Error('Unexpected token < in JSON');
        const mockResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockRejectedValue(jsonError)
        };
        global.fetch.mockResolvedValue(mockResponse);

        // Act & Assert - Now properly wraps the error
        await expect(api.getTasks()).rejects.toThrow('Failed to fetch tasks: Unexpected token < in JSON');
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });

    // Test Case 5: API returns empty array
    test('should handle empty task list from API', async () => {
        // Arrange: Mock empty response
        const mockResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue([])
        };
        global.fetch.mockResolvedValue(mockResponse);

        // Act
        const result = await api.getTasks();

        // Assert
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Test Case 6: Verify console.error is called (warning about real API usage)
    test('should log warning message about real API call', async () => {
        // Arrange: Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const mockResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(MOCK_TASKS_RESPONSE)
        };
        global.fetch.mockResolvedValue(mockResponse);

        // Act
        await api.getTasks();

        // Assert: Verify warning was logged
        expect(consoleErrorSpy).toHaveBeenCalledWith('Real API call initiated. Should be mocked in unit tests.');

        // Cleanup
        consoleErrorSpy.mockRestore();
    });
});
