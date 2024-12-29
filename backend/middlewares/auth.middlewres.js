import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'unquthorized User' });
        }

        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            res.cookie('token', '');
            return res.status(401).send({ error: 'unquthorized User' });
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'unquthorized User' });
    }
}