import { Router, Request, Response } from "express";
import { checkUniqueUsername, registerUser, checkUserExists, getHashedPasswordByUsername, 
    searchIgredientName, checkIngredientExists, hasUserAddRestrictedIngredient, addIngredient, fetchIngredientbyUserName, deleteIngredient} from "./user.service";
import { Recipe } from "../../models/entity";
import {startAuthenticatedSession, endAuthenticatedSession} from './auth';
import { authenticateSession } from '../../middleware/auth.middleware';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const router = Router();

const SECRET_KEY = 'your_secret_key';

// body: {"username": string, "password": string}
// response: {"message": "User registered"}
// if username already exists, return 400 with message: "Username is not unique"
// if user registered successfully, return 200 with message: "User registered"
router.get("/register", async (req: Request, res: Response) => {
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

// body: {"username": string, "password": string}
// response: {"message": "User logged in"}, new session will be created
// if username does not exist, return 400 with message: "User does not exist"
// if password is incorrect, return 400 with message: "Invalid password"
// if user logged in successfully, return 200 with message: "User logged in"
router.get("/login", async (req: Request, res: Response) => {
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

// response: {"message": "User logged out"}
router.get("/logout", async (req: Request, res: Response) => {
    try{
        await endAuthenticatedSession(req, (err: any) => {
            if (err) {
                throw err;
            }
        });
        console.log("User logged out");
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

// vague search restriction names. Make sure to user select the ingredient name from database
// request body: {"restriction_name": string}
// response: [{"ingredient_name": string}, ...]
// e.g. searchIgredientName("apple") => [{"ingredient_name": "apple"}, {"ingredient_name": "apple sauce"}, ...]
router.get("/getIngredientNames", authenticateSession, async (req: Request, res: Response) => {
    try {
        // const ingredientString = req.body.ingredientString;
        const ingredientString = "apple";

        console.log("Fetching restriction names...");
        const ingredientNames = await searchIgredientName(ingredientString);
        console.log(`Found ${ingredientNames.length} restriction names`);
        res.status(200).json(ingredientNames);

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching restriction names",
            error: error.message,
        });
    }
});

// remain login status, send post request with no body
// response: [{"ingredient_name": string}, ...]
// e.g. 
// [
//   { ingredient_name: 'appl' },
//   { ingredient_name: 'apple brand' },
//   { ingredient_name: 'apple chi' }
// ]
router.get("/getRestrictionsByUserName", authenticateSession, async (req: Request, res: Response) => {
    try {
        // const ingredientString = req.body.ingredientString;
        const username = req.session.user;

        console.log("Fetching restriction names...");
        const ingredientNames = await fetchIngredientbyUserName(username);
        console.log(`Found ${ingredientNames.length} restriction names`);
        res.status(200).json(ingredientNames);

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching restriction names",
            error: error.message,
        });
    }
});

// remain login status, send post request with body: {"ingredient_name": string}
// expected response: {"message": "Restriction added"}
// if ingredient does not exist, return 400 with message: "Ingredient does not exist"
// if user has already added the ingredient, return 400 with message: "User has already added ingredient"
// if restriction added successfully, return 200 with message: "Restriction added"
router.get("/addUserRestriction", authenticateSession, async (req: Request, res: Response) => {
    try {
        // const ingredientString = req.body.ingredientString;apple
        const username = req.session.user;
        // const ingredientString = req.body.ingredient_name;
        const ingredientString = "apple chip"; // hard code for now
        console.log("Adding restriction...");

        const isIngredientExists = await checkIngredientExists(ingredientString);
        if (!isIngredientExists) {
            res.status(400).json({
                message: "Ingredient " + ingredientString + " does not exist",
                error: "Ingredient does not exist",
            });
            return;
        }

        const hasUserAdded = await hasUserAddRestrictedIngredient(username, ingredientString);
        if (hasUserAdded) {
            res.status(400).json({
                message: "User has already added ingredient " + ingredientString,
                error: "User has already added ingredient",
            });
            return;
        }

        const result = await addIngredient(username, ingredientString);

        console.log("Restriction added");
        res.status(200).json({
            message: "Restriction added",
        });

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching restriction names",
            error: error.message,
        });
    }
});

// remain login status, send post request with body: {"ingredient_name": string}
// expected response: {"message": "Restriction deleted"}
// if ingredient does not exist, return 400 with message: "Ingredient does not exist"
// if user has not added the ingredient, return 400 with message: "User has not added ingredient"
// if restriction deleted successfully, return 200 with message: "Restriction deleted"
router.get("/deleteUserRestriction", authenticateSession, async (req: Request, res: Response) => {
    try {
        const username = req.session.user;
        // const ingredientString = req.body.ingredient_name;
        const ingredientString = "apple chip"; // hard code for now
        console.log("Deleting restriction...");

        const isIngredientExists = await checkIngredientExists(ingredientString);
        if (!isIngredientExists) {
            res.status(400).json({
                message: "Ingredient " + ingredientString + " does not exist",
                error: "Ingredient does not exist",
            });
            return;
        }
        console.log("Ingredient exists");

        const hasUserAdded = await hasUserAddRestrictedIngredient(username, ingredientString);

        if (!hasUserAdded) {
            res.status(400).json({
                message: "User has not added ingredient " + ingredientString,
                error: "User has not added ingredient",
            });
            return;
        }
        console.log("User has added ingredient");

        const result = await deleteIngredient(username, ingredientString);

        
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }

});
    

export default router;