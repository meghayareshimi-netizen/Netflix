const axios = require('axios');

async function test() {
    try {
        const response = await axios.post('http://localhost:5000/api/register', {
            username: 'testuser_' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            phone: '1234567890'
        });
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
    }
}

test();
