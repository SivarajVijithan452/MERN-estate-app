import User from './../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => { 
    try {
        const { username, email, password } = req.body;
        
        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.username === username 
                    ? 'Username already exists' 
                    : 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.name === 'ValidationError' 
                ? 'Invalid input data' 
                : 'Internal server error',
            error: error.message
        });
    }
 }