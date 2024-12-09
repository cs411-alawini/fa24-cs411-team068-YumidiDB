import { Router, Request, Response } from "express";
import { createCustomizedRecipe } from "./collection.service";
import { Recipe } from "../../models/entity";
import { authenticateSession } from '../../middleware/auth.middleware';

const router = Router();

// remain login status, {"recipe_id": int}
router.get("/createCustomizedRecipe", authenticateSession,async (req: Request, res: Response) => {
    const username = req.session.user;
    // const recipe_id = req.body.recipe_id;
    const recipe_id = 38; // test

    console.log("Creating customized recipe...");

    const result = await createCustomizedRecipe(recipe_id, username);

    console.log("Customized recipe created");
    res.status(200).json({"message": "Customized recipe created"});

});

export default router;