import jwt from "jsonwebtoken";
import {UserType} from "../data/user";
import {getEnv} from "./env";
import {Request, Response, NextFunction} from "express";

// Create JWT
export function generateAccessToken(user: UserType): string
{
    return jwt.sign({sub: user._id}, getEnv("JWT_SECRET"), {
        algorithm: "HS256",
        expiresIn: "1h",
    });
}

// Middleware for JWT authentication, import and add to backend routes for pages that should require authentication
// ex: router.get("/", authToken, (_req: Request, res: Response) =>
export function authToken(
    req: Request,
    res: Response,
    next: NextFunction,
): void
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
    {
        console.log("No token received");
        res.status(401).send("Authentication required");
    }
    else
    {
        try
        {
            const decoded = jwt.verify(token, getEnv("JWT_SECRET"));
            console.log("Decoded token: ", decoded);
            req.sub = decoded.sub;
            next();
        }
        catch (err)
        {
            console.error(err);
            res.status(401).send(err);
        }
    }
}
