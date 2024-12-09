import { Router, Request, Response } from "express";
import { getTopRecipe, getRecipeByFilter, getAvgRating } from "./planner.service";
import { Recipe } from "../../models/entity";
import { authenticateSession } from '../../middleware/auth.middleware';



const router = Router();

router.get("/getTopRecipe", authenticateSession,async (req: Request, res: Response) => {
    try {
        console.log("Fetching top recipes...");
        const topRecipe: Recipe[] = await getTopRecipe();
        console.log(`Found ${topRecipe.length} recipes`);
        res.status(200).json(topRecipe);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching top recipes",
            error: error.message,
        });
    }
});

// remain login status, {"count": int, "min_calories": int, "max_calories": int}
router.get("/getRecipeByFilter", authenticateSession, async (req: Request, res: Response) => {
    // request body: {"count": int, "min_calories": int, "max_calories": int}
    try {
        const username = req.session.user;
        console.log("Fetching recipes by filter...");
        console.log("username: ", username);
        const filter = req.body;
        // check if filter is valid
        if (!filter.count || !filter.min_calories || !filter.max_calories) {
            // res.status(400).json({
            //     message: "Invalid filter",
            //     error: "Filter must contain count, min_calories, and max_calories not NULL!!!!!!!!",
            // });
            // return;
            filter.count = 5;
            filter.min_calories = 0;
            filter.max_calories = 1000;
        }
        const recipes: Recipe[] = await getRecipeByFilter(filter, username);
        console.log(`Found ${recipes.length} recipes`);
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching recipes by filter",
            error: error.message,
        });
    }
});

// remain login status, no body needed, return top 15 rated recipes
router.get("/avgRating", authenticateSession,async (req: Request, res: Response) => {
    try {;

        console.log("Fetching average rating...");
        const avgRating = await getAvgRating();
        console.log("Average rating fetched");
        res.status(200).json(avgRating);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching average rating",
            error: error.message,
        });
    }
});




export default router;
