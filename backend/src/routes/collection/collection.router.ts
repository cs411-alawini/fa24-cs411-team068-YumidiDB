import { Router, Request, Response } from "express";
import { createCustomizedRecipe, getIngredients, getCustomizedRecipeList, updateIngredient, deleteCustomizedRecipe } from "./collection.service";
import { Recipe } from "../../models/entity";
import { authenticateSession } from '../../middleware/auth.middleware';

const router = Router();

// remain login status, {"recipe_id": int}
// expected response: {"message": "Customized recipe created"}
router.post("/createCustomizedRecipe", authenticateSession, async (req: Request, res: Response) => {
    try {
        const username = req.session.user;
        const recipe_id = req.body.recipe_id;
        
        console.log("Creating customized recipe...");
        console.log("Username:", username);
        console.log("Recipe ID:", recipe_id);
        
        if (!username || !recipe_id) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const result = await createCustomizedRecipe(recipe_id, username);
        
        console.log("Customized recipe created");
        res.status(200).json({
            message: "Customized recipe created"
        });
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error creating customized recipe",
            error: error.message,
        });
    }
});

// remain login status, {"customized_id": number}, return ingredients of the recipe
// expected response: [{"ingredient_id": int, "ingredient_name": string, "ingredient_amount": int, "ingredient_unit": string}]
// e.g. req: {"customized_id": 990291001},
// [
//     {
//         "ingredient_id": 3355,
//         "ingredient_name": "granulated sugar",
//         "ingredient_amount": null,
//         "ingredient_unit": null
//     }, ...
// ]
router.post("/getIngredients", authenticateSession,async (req: Request, res: Response) => {
    try{
        const username = req.session.user;
        const customized_id = req.body.customized_id;
        // const customized_id = 990291001; // test
        console.log("Fetching ingredients...");
        const ingredients = await getIngredients(customized_id, username);
        console.log("Ingredients fetched");
        // res.status(200).json(ingredients);
        res.status(200).json(ingredients);

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching ingredients",
            error: error.message,
        });
    
    }
});


// remain login status, return customized recipe list of the user.
// e.g. login with peiyang, send request, no body needed
// [
//     {
//         "customized_id": 92837097,
//         "user_id": 896173997,
//         "name": "low fat berry blue frozen dessert",
//         "minutes": 1485,
//         "steps": "['toss 2 cups berries with sugar', 'let stand for 45 minutes , stirring occasionally', 'transfer berry-sugar mixture to food processor', 'add yogurt and process until smooth', 'strain through fine sieve', 'pour into baking pan', 'freeze uncovered until edges are solid but centre is soft', 'transfer to processor and blend until smooth again', 'return to pan and freeze until edges are solid', 'transfer to processor and blend until smooth again', 'fold in remaining 2 cups of blueberries', 'pour into plastic mold and freeze overnight', 'let soften slightly to serve']",
//         "description": "this is yummy and low-fat, it always turns out perfect.",
//         "fat": 170.9,
//         "calories": 3
//     },...
// ]
router.post("/getCustomizedRecipeList", authenticateSession, async (req: Request, res: Response) => {
    try{
        const username = req.session.user;
        console.log("Fetching customized recipe list...");
        const recipes = await getCustomizedRecipeList(username);
        console.log("Customized recipe list fetched");
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error fetching customized recipe list",
            error: error.message,
        });
    }
    
});

// updateIngredient(customized_id, ingredient_id, amount, unit)
// expected response: {"message": "Ingredient updated"}
// e.g. req: {"customized_id": 990291001, "ingredient_id": 3355, "amount": 100, "unit": "g"}
router.post("/updateIngredient", authenticateSession,async (req: Request, res: Response) => {
    try{
        const username = req.session.user;
        const customized_id = req.body.customized_id;
        const ingredient_id = req.body.ingredient_id;
        const amount = req.body.amount;
        const unit = req.body.unit;

        // const username = req.session.user;
        // const customized_id = 990291001;
        // const ingredient_id = 3355;
        // const amount = 100;
        // const unit = "g";
    
        const result = await updateIngredient(customized_id, ingredient_id, amount, unit);

        console.log("Updating ingredient...");
        res.status(200).json({"message": "Ingredient updated"});

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error updating ingredient",
            error: error.message,
        });
    }
});

// remain login status, {"customized_id": number}, delete customized recipe
// expected response: {"message": "Customized recipe deleted"}
router.post("/deleteCustomizedRecipe", authenticateSession,async (req: Request, res: Response) => {
    try{
        const username = req.session.user;
        const customized_id = req.body.customized_id;
        // const customized_id = 788071968; // test
        console.log("Deleting customized recipe...");
        const result = await deleteCustomizedRecipe(customized_id);
        console.log("Customized recipe deleted");
        res.status(200).json({"message": "Customized recipe deleted"});
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            message: "Error deleting customized recipe",
            error: error.message,
        });
    }
});

export default router;