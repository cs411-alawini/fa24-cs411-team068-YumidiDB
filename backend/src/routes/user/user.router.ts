import { Router, Request, Response } from "express";
import { checkUniqueUsername, registerUser} from "./user.service";
import { Recipe } from "../../models/entity";
import bcrypt from "bcrypt";

const router = Router();

router.get("/register", async (req: Request, res: Response) => {
    try {
        console.log("Registering user...");
        // const username = req.body.username;
        // const password = req.body.password;
        const username = "peiyang";
        const password = "peiyang";
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

export default router;