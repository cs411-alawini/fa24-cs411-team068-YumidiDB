import { Router, Request, Response } from "express";
import { createCustomizedRecipe, getIngredients, getCustomizedRecipeList } from "./collection.service";
import { Recipe } from "../../models/entity";
import { authenticateSession } from '../../middleware/auth.middleware';

const router = Router();

// remain login status, {"recipe_id": int}
// expected response: {"message": "Customized recipe created"}
router.get("/createCustomizedRecipe", authenticateSession,async (req: Request, res: Response) => {
    const username = req.session.user;
    // const recipe_id = req.body.recipe_id;
    const recipe_id = 38; // test

    console.log("Creating customized recipe...");

    const result = await createCustomizedRecipe(recipe_id, username);

    console.log("Customized recipe created");
    res.status(200).json({"message": "Customized recipe created"});

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
router.get("/getIngredients", authenticateSession,async (req: Request, res: Response) => {
    const username = req.session.user;
    // const customized_id = req.body.customized_id;
    const customized_id = 990291001; // test
    console.log("Fetching ingredients...");
    const ingredients = await getIngredients(customized_id, username);
    console.log("Ingredients fetched");
    // res.status(200).json(ingredients);
    res.status(200).json(ingredients);
});


// remain login status, return customized recipe list of the user

router.get("/getCustomizedRecipeList", authenticateSession,async (req: Request, res: Response) => {
    const username = req.session.user;

    console.log("Fetching customized recipe list...");
    const recipes = await getCustomizedRecipeList(username);
    console.log("Customized recipe list fetched");
    res.status(200).json(recipes);
});


export default router;