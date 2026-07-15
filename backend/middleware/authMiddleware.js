const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No authorization header provided' });
        }
        
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
             return res.status(401).json({ message: 'Invalid token format' });
        }
        
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decodedData.id }; // Consistent with controllers
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
