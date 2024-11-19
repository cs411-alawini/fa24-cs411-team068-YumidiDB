import { Router, Request, Response } from "express";
import { getTopRecipe } from "./planner.service";
import { Recipe } from "../../models/entity";

const router = Router();

router.get("/getTopRecipe", async (req: Request, res: Response) => {
    try {
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

export default router;
