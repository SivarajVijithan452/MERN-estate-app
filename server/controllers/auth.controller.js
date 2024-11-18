import User from './../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
 

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // validate user
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({
            success: false,
            message: 'User not found'
        });

        // validate password
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return res.status(401).json({
            success: false,
            message: 'Invalid password Check your password'
        });

        // Create JWT token
        const token = jwt.sign(
            { id: validUser._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password from response
        const { password: pass, ...rest } = validUser._doc;

        // Set token in cookie and send response
        res.cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json({
                success: true,
                message: 'Signed in successfully',
                data: rest,
                token
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

export const google = async (req, res) => {
    try {
        // user exists or not
        const user = await User.findOne({ email: req.body.email });
        // if user exists, sign the token and send response
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({
                    success: true,
                    message: 'Signed in successfully',
                    data: rest,
                    token
                });
        }
        // if user does not exist, create a new user
        else {
            // generate a random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            // hash the password
            const hashedPassword = await bcrypt.hashSync(generatedPassword, 10);
            // create a new user
            const newUser = new User({ username: req.body.name, email: req.body.email, password: hashedPassword });
            await newUser.save();
            // sign the token and send response
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({
                    success: true,
                    message: 'User created successfully',
                    data: rest,
                    token
                });
        }
    } catch (error) {
        console.log(error);
    }
}