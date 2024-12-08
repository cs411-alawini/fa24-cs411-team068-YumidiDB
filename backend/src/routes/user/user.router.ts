import { Router, Request, Response } from "express";
import { checkUniqueUsername, registerUser, checkUserExists, getHashedPasswordByUsername} from "./user.service";
import { Recipe } from "../../models/entity";
import {startAuthenticatedSession, endAuthenticatedSession} from './auth';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const router = Router();

const SECRET_KEY = 'your_secret_key';

router.post("/register", async (req: Request, res: Response) => {
    try {
        console.log("Registering user...");
        const username = req.body.username;
        const password = req.body.password;
        // const username = "peiyang";
        // const password = "peiyang";
        console.log(username);
        if (!username || !username) {
            res.status(400).json({
                message: "Invalid user",
                error: "User must contain username and password not NULL!!!!!!!!",
            });
            return;
        }
        const isUnique = await checkUniqueUsername(username);
        if (!isUnique) {
            res.status(400).json({
                message: "Username is not unique",
                error: "Username already exists",
            });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = { username, password: hashedPassword };
        const newUser = await registerUser(user);
        console.log("User registered");
        res.status(200).json(newUser);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try{
        // const username = req.body.username;
        // const password = req.body.password;
        const username = "peiyang";
        const password = "peiyang";
        if (!username || !password) {
            res.status(400).json({
                message: "Invalid user",
                error: "User must contain username and password not NULL!!!!!!!!",
            });
            return;
        }
        const isUserExists = await checkUserExists(username);
        if (!isUserExists) {
            res.status(400).json({
                message: "User does not exist",
                error: "Username does not exist",
            });
            return;
        }

        const hashedPasswordObj = await getHashedPasswordByUsername(username);
        const hashedPassword = hashedPasswordObj.hashed_password;

        // console.log(hashedPassword);
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordCorrect) {
            res.status(400).json({
                message: "Invalid password",
                error: "Password is incorrect",
            });
            return;
        }

        // req.session.user = { username };
        // console.log("User logged in");
        await startAuthenticatedSession(req, username, (err: any) => {
            if (err) {
                throw err;
            }
        });

        res.status(200).json({
            message: "User logged in",
        });

    }
    catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error logging in user",
            error: error.message,
        });
    }
});

router.post("/logout", async (req: Request, res: Response) => {
    try{
        await endAuthenticatedSession(req, (err: any) => {
            if (err) {
                throw err;
            }
        });
        res.status(200).json({
            message: "User logged out",
        });
    }
    catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error logging out user",
            error: error.message,
        });
    }
});
    

export default router;