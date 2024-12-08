import jwt from 'jsonwebtoken';

// filepath: /Users/murasame/UIUC/2024Fall/CS411/fa24-cs411-team068-YumidiDB/backend/src/middleware/auth.middleware.ts
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] as string;
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

export const authenticateSession = (req, res, next) => {
    console.log("Checking session...");
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: "Access denied, please log in" });
    }
};