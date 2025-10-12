const api = require('../services/api');

// This function simulates the core logic (e.g., inside a Vue component's 'methods' or 'setup')
exports.loadTasks = async () => {
    try {
        const rawTasks = await api.getTasks();
        
        // This is the unit we want to test: data transformation and loading
        const formattedTasks = rawTasks.map(task => ({
            id: task.id,
            display: task.name + (task.completed ? ' (DONE)' : ''),
            status: task.completed ? 'Success' : 'Pending'
        }));

        return { tasks: formattedTasks, error: null };
    } catch (err) {
        return { tasks: [], error: 'Failed to load tasks from server.' };
    }
};
