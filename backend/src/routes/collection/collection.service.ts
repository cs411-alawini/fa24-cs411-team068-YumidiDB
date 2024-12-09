import { Recipe } from "../../models/entity";
import pool from "../../utils/connection";
import { RowDataPacket } from "mysql2";
import crc32 from 'crc-32';

export async function createCustomizedRecipe(recipe_id: number, username: string): Promise<any> {
    const user_id = Math.abs(crc32.str(username));

    const [original_recipe] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Recipes WHERE recipe_id = ?`,
        [recipe_id]
    );

    console.log(original_recipe[0]);

    // generate custumized_id with user_id and current time
    const custumized_id = Math.abs(crc32.str(`${user_id}${Date.now()}`));

    // insert into Customized_Recipes
    // CustomizedRecipe {
    //     customized_id: number;
    //     user_id: number;
    //     name: string;
    //     minutes: number;
    //     steps: string;
    //     description: string;
    //     fat: number;
    //     calories: number;
    // }
    const [rows] = await pool.query<RowDataPacket[]>(
        `INSERT INTO CustomizedRecipes (customized_id, user_id, name, minutes, steps, description, fat, calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [custumized_id, user_id, original_recipe[0].name, original_recipe[0].minutes, original_recipe[0].steps, original_recipe[0].description, original_recipe[0].fat, original_recipe[0].calories]
    );

    // select ingradient with recipe_id, and put them in the Customized_Recipe_Ingredients
    const [ingredient_ids] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM recipe_ingredient WHERE recipe_id = ?`,
        [recipe_id]
    );

    console.log(ingredient_ids);

    // insert into Customized_Recipe_Ingredients
    // export interface IngredientPortion {
    // id: number;
    // customized_id: number;
    // ingredient_id: number;
    // ingredient_amount: number;
    // ingredient_unit: string;}

    const id = Math.abs(crc32.str(`${custumized_id}${ingredient_ids[0].ingredient_id}${Date.now()}`));
    for (let i = 0; i < ingredient_ids.length; i++) {
        const id = Math.abs(crc32.str(`${custumized_id}${ingredient_ids[i].ingredient_id}${Date.now()}`));
        const [rows] = await pool.query<RowDataPacket[]>(
            `INSERT INTO ingredient_portion (id, customized_id, ingredient_id, ingredient_amount, ingredient_unit) VALUES (?, ?, ?, ?, ?)`,
            [id, custumized_id, ingredient_ids[i].ingredient_id, null, null]
        );
    }
    
    return;

    // sql to clear table ingredient_portion: DELETE FROM ingredient_portion;
}

// export async function createCustomizedRecipe(recipe_id: number, username: string): Promise<any> {
//     const [rows] = await pool.query<RowDataPacket[]>(
//         `CALL createCustomizedRecipe(?, ?, @customized_id)`,
//         [recipe_id, username]
//     );

//     const [result] = await pool.query<RowDataPacket[]>(
//         `SELECT @customized_id AS customized_id`
//     );

//     console.log(result[0].customized_id);

//     return result[0].customized_id;
// }

export async function getIngredients(customized_id: number, username: string): Promise<any> {
    const user_id = Math.abs(crc32.str(username));

    const [ingredients_arr] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Ingredients NATURAL JOIN ingredient_portion WHERE customized_id = ?`,
        [customized_id] 
    );

    // console.log(ingredients_arr);

    const ingredients = ingredients_arr.map((row) => ({
        "ingredient_id": row.ingredient_id,
        "ingredient_name": row.ingredient_name.slice(0, -1),
        "ingredient_amount": row.ingredient_amount,
        "ingredient_unit": row.ingredient_unit}));

    // console.log(ingredients);

    return ingredients; 
}

export async function getCustomizedRecipeList(username: string): Promise<any> {
    const user_id = Math.abs(crc32.str(username));

    const [customized_recipe_list] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM CustomizedRecipes WHERE user_id = ?`,
        [user_id]
    );

    console.log(customized_recipe_list);

    return customized_recipe_list;
}

export async function updateIngredient(customized_id: number, ingredient_id: number, amount: number, unit: string): Promise<any> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `UPDATE ingredient_portion SET ingredient_amount = ?, ingredient_unit = ? WHERE customized_id = ? AND ingredient_id = ?`,
        [amount, unit, customized_id, ingredient_id]
    );

    return rows;
}

export async function deleteCustomizedRecipe(customized_id: number): Promise<any> {

    const [rows] = await pool.query<RowDataPacket[]>(
        `DELETE FROM CustomizedRecipes WHERE customized_id = ?`,
        [customized_id]
    );

    const [rows2] = await pool.query<RowDataPacket[]>(
        `DELETE FROM ingredient_portion WHERE customized_id = ?`,
        [customized_id]
    );

    return rows;
}