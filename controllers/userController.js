const { users } = require('./authController');

const getProfile = (request, response) => {
    try {
        const user = users.find(u => u.id === request.user.id);

        if (!user) {
            return response.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        response.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getAllUsers = (request, response) => {
    try {
        const allUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }));

        response.status(200).json({
            success: true,
            count: allUsers.length,
            users: allUsers
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getProfile,
    getAllUsers
};
