const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { registerSchema, loginSchema } = require('../utils/validators');

let users = [];
let userIdCounter = 1;

const register = async (request, response) => {
    try {
        const { error, value } = registerSchema.validate(request.body);

        if (error) {
            return response.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { username, email, password, role } = value;

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return response.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const existingUsername = users.find(u => u.username === username);
        if (existingUsername) {
            return response.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: userIdCounter++,
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        response.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

const login = async (request, response) => {
    try {
        const { error, value } = loginSchema.validate(request.body);

        if (error) {
            return response.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { email, password } = value;

        const user = users.find(u => u.email === email);
        if (!user) {
            return response.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);

        response.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    users
};
