import { Router, Request, Response } from "express";
import { getTopRecipe, getRecipeByFilter } from "./planner.service";
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

router.get("/getRecipeByFilter", async (req: Request, res: Response) => {
    try {
        const filter = {
            count: parseInt(req.query.count as string) || 15,
            min_calories: parseInt(req.query.min_calories as string) || 0,
            max_calories: parseInt(req.query.max_calories as string) || 1000
        };

        if (isNaN(filter.min_calories) || isNaN(filter.max_calories) || isNaN(filter.count)) {
            res.status(400).json({
                message: "Invalid filter",
                error: "Parameters must be valid numbers"
            });
            return;
        }

        const recipes: Recipe[] = await getRecipeByFilter(filter);
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching recipes by filter",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

export default router;
