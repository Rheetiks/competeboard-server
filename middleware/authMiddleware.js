const jwt = require('jsonwebtoken'); // Import jsonwebtoken

exports.authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    console.log("Token received:", token); 

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Decoded token:", decoded); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(400).json({ error: 'Invalid token' });
    }
};
