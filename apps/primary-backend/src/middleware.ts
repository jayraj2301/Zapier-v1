import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.accessToken || req.headers.authorization as string;
    
    try {
        const payload = jwt.verify(token, "secret");
        //@ts-ignore
        req.id = payload.id;
        next();
    } catch (err) {
        res.status(403).json({
            message: "You are not authorize"
        });
        return;
    }
}