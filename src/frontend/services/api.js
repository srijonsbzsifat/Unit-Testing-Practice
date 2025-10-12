// This file simulates a dependency that makes a real API call.
const BASE_URL = 'http://api.myapp.com/tasks';

exports.getTasks = async () => {
    // In a real app, this would use fetch or axios.
    console.error('Real API call initiated. Should be mocked in unit tests.');
    const response = await fetch(BASE_URL); 
    return response.json();
};
