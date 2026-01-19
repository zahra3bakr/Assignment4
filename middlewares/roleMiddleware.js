const { request } = require("express");

const roleMiddleware = (...allowedRoles) => {
    return (request, response, next) => {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            if (!allowedRoles.includes(request.user.role)) {
                return response.status(403).json({
                    success: false,
                    message: 'Access denied. You do not have permission to access this resource'
                });
            }

            next();
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    };
};

module.exports = roleMiddleware;
