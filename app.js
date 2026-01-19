require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (request, response) => {
    response.json({
        success: true,
        message: 'Welcome to Authentication API',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            users: {
                profile: 'GET /api/users/profile (Protected)',
                allUsers: 'GET /api/users/all (Admin only)'
            }
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((request, response) => {
    response.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: error.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Authentication API is ready!');
});
