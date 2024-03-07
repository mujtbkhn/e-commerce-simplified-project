const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');


const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization
    try {

        if (!token) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        const decodedToken = jwt.verify(token, JWT_SECRET)
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        req.userId = decodedToken.userId;
        next()
    } catch (error) {
        res.status(411).json({
            message: "invalid token"
        })
    }
}

module.exports = { authMiddleware }