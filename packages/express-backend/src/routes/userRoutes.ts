import {Router, Request, Response} from "express";
import userServices from "../services/userServices";
import {UserType} from "../data/user";
import {hashPassword, verifyPassword} from "../util/password";
import {generateAccessToken} from "../util/jwt";
import {validatePassword} from "../util/pwValidator";

//all start with /users
const router = Router();

router.post("/register", (req: Request, res: Response) =>
{
    /**
     * req.body = user =
     * {
     * name: String, required
     * email: String, required
     * password: String, required
     * units: String "lbs" or "kilo" has default
     * sessionLogId: not required
     * currentSessionId: not required
     * machines: [machine: type], not required
     * }
     */
    const userData = req.body as UserType;
    if (!userData.password || !userData.email)
    {
        res.status(400).send("Bad request: Email and password are required");
        return;
    }

    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid)
    {
        res.status(400).json({
            error: "Password does not meet requirements",
            details: passwordValidation.errors,
        });
        return;
    }

    userServices
        .getUser(userData.email)
        .then(async (userExists) =>
        {
            if (userExists)
            {
                return res.status(409).send("User already exists");
            }
            else
            {
                userData.password = await hashPassword(userData.password);
                await userServices.addUser(userData);
                return res.status(201).send("User added successfully");
            }
        })
        .catch((error) =>
        {
            return res.status(400).send("Bad Request: " + error);
        });
});

router.post(
    "/login",
    (
        req: Request<object, object, {email: string; password: string}>,
        res: Response,
    ) =>
    {
        const userEmail = req.body.email;
        const password = req.body.password;
        userServices
            .getUser(userEmail, true)
            .then(async (user) =>
            {
                if (user)
                {
                    // Check for valid password
                    const isValid = await verifyPassword(
                        user.password,
                        password,
                    );
                    if (isValid)
                    {
                        const token = generateAccessToken(user);
                        res.status(200).send(token);
                    }
                    else
                    {
                        res.status(401).send("Unauthorized");
                    }
                }
                else
                {
                    // User not found (invalid email login)
                    res.status(401).send("Unauthorized");
                }
            })
            .catch((error) =>
            {
                res.status(400).send("Bad Request: " + error);
            });
    },
);

export default router;
