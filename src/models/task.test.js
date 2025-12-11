const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Task = require('../models/task'); 

let mongoServer;
let seedTaskId; // To store the ID of a specific seeded task for targeted testing

// --- Setup/Teardown: In-Memory MongoDB Configuration ---
describe('Task Model Unit Tests (In-Memory MongoDB & Async)', () => {
    
    // 1. Setup Database Connection (Async)
    beforeAll(async () => {
        try {
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log('Connected to In-Memory MongoDB.');
        } catch (error) {
            console.error('Failed to connect to in-memory DB:', error);
        }
    });

    // 2. Isolate/Seed Data (beforeEach for Isolation)
    beforeEach(async () => {
        await Task.deleteMany({}); // Clears previous state, ensuring isolation
        
        // Seed Data 1 (Retrieval Test Target)
        const taskA = await Task.create({ name: 'Seed Task A', completed: false });
        // Seed Data 2 (Deletion Test Target)
        const taskB = await Task.create({ name: 'Seed Task B', completed: true });
        
        seedTaskId = taskB._id;
    });

    // 3. Teardown Database Connection (Async)
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        console.log('Disconnected from In-Memory MongoDB.');
    });

    // --- Writing Test Cases (Async & MongoDB Operations) ---

    test('should save a new task and persist it in the database (Async)', async () => {
        // Arrange
        const taskData = { name: 'New Task for Persistence Test' };

        // Act (Async execution of creation)
        const savedTask = await Task.create(taskData);

        // Assert (Verification of result object)
        expect(savedTask.name).toBe(taskData.name);
        expect(savedTask.completed).toBe(false);
        
        // Assert (Verification of database state)
        const foundTask = await Task.findById(savedTask._id);
        expect(foundTask.name).toBe(taskData.name);
    });

    test('should correctly retrieve a specific seeded task', async () => {
        // Act (Async retrieval)
        const task = await Task.findOne({ name: 'Seed Task A' });

        // Assert
        expect(task).toBeDefined();
        expect(task.completed).toBe(false);
    });

    test('should successfully delete a task by ID (Async)', async () => {
        // Act (Async deletion)
        await Task.deleteOne({ _id: seedTaskId });

        // Assert (Verify it no longer exists)
        const foundTask = await Task.findById(seedTaskId);
        expect(foundTask).toBeNull();
    });

    // --- Handling Error Scenarios (Async) ---

    test('should reject creation if task name is missing (Async Error Scenario)', async () => {
        // Arrange
        const invalidTaskData = { completed: true };

        // Act & Assert: Expect Mongoose to throw a ValidationError using Jest's `rejects.toThrow`
        await expect(Task.create(invalidTaskData)).rejects.toThrow(mongoose.Error.ValidationError);
        
        // Detailed check on the error message
        await expect(Task.create(invalidTaskData)).rejects.toThrow('Task name is required.');
    });

    test('should fail when attempting to find a task with a malformed ID', async () => {
        // Arrange: A string that is not a valid 12-byte MongoDB ObjectId
        const malformedId = 'not-a-valid-id'; 

        // Act & Assert: Expect a Mongoose CastError when attempting to convert the string
        await expect(Task.findById(malformedId)).rejects.toThrow(mongoose.Error.CastError);
        
        // Detailed check on the error message fragment
        await expect(Task.findById(malformedId)).rejects.toThrow('Cast to ObjectId failed');
    });
});
