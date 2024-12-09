import { Router, Request, Response } from "express";
import { getTopRecipe, getRecipeByFilter, getAvgRating, getRecipeWithinDate, popularTopRecipe, getComplexRecipe, getIngredientsByRecipeId, getCaloriesDiff } from "./planner.service";
import { Recipe } from "../../models/entity";
import { authenticateSession } from '../../middleware/auth.middleware';



const router = Router();

router.post("/getTopRecipe", authenticateSession,async (req: Request, res: Response) => {
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
router.post("/getRecipeByFilter", authenticateSession, async (req: Request, res: Response) => {
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

// get ingredients of a recipe by recipe_id
// remain login status, {"recipe_id": int}
router.post("/getIngredientsByRecipeId", authenticateSession, async (req: Request, res: Response) => {
    try {
        const recipe_id = req.body.recipe_id;
        // const recipe_id = 38; // test
        console.log("Fetching ingredients by recipe_id...");
        const ingredients = await getIngredientsByRecipeId(recipe_id);
        console.log("Ingredients fetched");
        res.status(200).json(ingredients);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching ingredients by recipe_id",
            error: error.message,
        });
    }
});

// remain login status, no body needed, return top 15 rated recipes
router.post("/avgRating", authenticateSession,async (req: Request, res: Response) => {
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

// remain login status, {"start_date": string, "end_date": string, "count": int}
// return top recipes within date, limited by count
// e.g. req: {"start_date": "2003-1-1", "end_date": "2003-12-31", "count": 15}
router.get("/topRecipeWithinDate", authenticateSession, async (req: Request, res: Response) => {
    try {
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const count = req.body.count;
        // const start_date = '2003-1-1';
        // const end_date = '2003-12-31';
        // const count = 15;

        console.log("Fetching top recipes within date...");

        // check if filter is valid
        if (!count || !start_date || !end_date) {
            res.status(400).json({
                message: "Invalid filter",
                error: "Filter must contain count, start_date, and end_date not NULL!!!!!!!!",
            });
            return;
        }
        const recipes: Recipe[] = await getRecipeWithinDate(start_date, end_date, count);
        console.log(`Found ${recipes.length} recipes`);
        res.status(200).json(recipes);
    }

    catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching top recipes within date",
            error: error.message,
        });
    }
});

// Get the recipe that uses ingredient A as an ingredient and has calories less than B and number of reviews larger than 10, order the result based review count from high to low.
// remain login status, {"ingredient_name": string, "calories": int, "count": int}
router.post("/popularTopRecipe", authenticateSession, async (req: Request, res: Response) => {
    try {
        // const ingredient_name = "beef"; // test
        // const calories = 600; // test
        // const count = 5; // test
        const ingredient_name = req.body.ingredient_name;
        const calories = req.body.calories;
        const count = req.body.count;

        console.log("Fetching popular top recipes...");
        const recipes: Recipe[] = await popularTopRecipe(ingredient_name, calories, count);
        console.log(`Found ${recipes.length} recipes`);
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching popular top recipes",
            error: error.message,
        });
    }
});

// Retrieve the recipes that require more than 10 ingredients.
// remain login status, {"count": int}
router.post("/getComplexRecipe", authenticateSession, async (req: Request, res: Response) => {
    try {

        const count = 15; // test
        // const count = req.body.count;

        console.log("Fetching complex recipes...");
        const recipes: Recipe[] = await getComplexRecipe(count);
        console.log(`Found ${recipes.length} recipes`);
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching complex recipes",
            error: error.message,
        });
    }
});

// diff of calory of most popular 10 and least popular 10 recipes
router.post("/caloriesDiff", authenticateSession, async (req: Request, res: Response) => {
    try {
        const diff = await getCaloriesDiff();
        console.log("Calories diff fetched");
        res.status(200).json(diff);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching calories diff",
            error: error.message,
        });
    }
});


export default router;
