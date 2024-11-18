import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Clear the expired cookie
                res.clearCookie('access_token');
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired. Please sign in again.'
                });
            }
            console.log('JWT Verification Error:', err.message);
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
};