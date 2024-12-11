import { Recipe } from "../../models/entity";
import pool from "../../utils/connection";
import { RowDataPacket } from "mysql2";
import crc32 from 'crc-32';

export async function getTopRecipe(): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Recipes 
     NATURAL JOIN Reviews 
     WHERE recipe_id IN (
       SELECT DISTINCT recipe_id 
       FROM Reviews 
       NATURAL JOIN Recipes 
       WHERE date >= ? AND date <= ?
     ) 
     ORDER BY rating DESC LIMIT 15`,
        [`2003-01-01`, `2003-12-31`]
    );

    return rows as any[];
}

export async function getRecipeByFilter(filter: any, username: string): Promise<any[]> {

    const user_id = Math.abs(crc32.str(username));

    // find the registration of the user
    // const [restricted_ingradient] = await pool.query<RowDataPacket[]>(
    //     `SELECT ingredient_id FROM user_restriction 
    //     WHERE user_id = ?`,
    //     [user_id]
    // );

    // console.log(restricted_ingradient);

    // find restricted recipe
    // const [restricted_recipe] = await pool.query<RowDataPacket[]>(
    //     `SELECT recipe_id FROM recipe_ingredient 
    //     WHERE ingredient_id IN (?)`,
    //     [restricted_ingradient]
    // );

    // console.log(restricted_recipe);
    
    // const { count, min_calories, max_calories } = filter;
    // const [rows] = await pool.query<RowDataPacket[]>(
    //     `SELECT * FROM Recipes 
    //      WHERE calories >= ? AND calories <= ? 
    //      AND recipe_id NOT IN (?) 
    //      LIMIT ?`,
    //     [min_calories, max_calories, restricted_recipe, count]
    // );
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Recipes WHERE recipe_id not in 
            (SELECT recipe_id FROM recipe_ingredient WHERE ingredient_id in
                (SELECT ingredient_id from user_restriction where user_id = ?))
            and calories >= ? and calories <= ? limit ?`,
        [user_id, filter.min_calories, filter.max_calories, filter.count]
    );

    return rows as any[];
}

export async function getAvgRating(username: string): Promise<any[]> {
    const user_id = Math.abs(crc32.str(username));
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT
            recipe_id, name, AVG(rating)
        FROM
            Reviews NATURAL JOIN Recipes
        GROUP BY
            recipe_id
        HAVING user_id not in (SELECT user_id from user_restriction where user_id = ?)
        LIMIT 15;`,
        [user_id]
    );
    console.log(rows);

    return rows as any[];
}

export async function getRecipeWithinDate(start_date: string, end_date: string, count: number, username: string): Promise<any[]> {
    const user_id = Math.abs(crc32.str(username));
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT
            DISTINCT recipe_id, name, rating
        FROM
            Recipes NATURAL JOIN Reviews
        WHERE
            recipe_id in (
                SELECT DISTINCT
                    recipe_id
                FROM
                    Reviews NATURAL JOIN Recipes
                WHERE
                date >= ? and date <= ?
                )
        ORDER BY
            rating DESC
        HAVING user_id not in (SELECT user_id from user_restriction where user_id = ?)
        LIMIT ?;`,
        [start_date, end_date, user_id, count]
    );

    return rows as any[];
}

export async function popularTopRecipe(ingredient_name: string, calories: number, count: number, username: string): Promise<any[]> {
    const user_id = Math.abs(crc32.str(username));
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT Recipes.recipe_id, name, description, calories, COUNT(review_id) AS review_count
        FROM Recipes
            JOIN Reviews ON Recipes.recipe_id = Reviews.recipe_id
        JOIN recipe_ingredient ON Recipes.recipe_id = recipe_ingredient.recipe_id
            JOIN Ingredients ON Ingredients.ingredient_id = recipe_ingredient.ingredient_id
        WHERE calories < ? and ingredient_name like ?
        and ingredient_id not in (SELECT ingredient_id from user_restriction where user_id = ?)
        GROUP BY recipe_id, name, calories, description
        HAVING COUNT(review_id) > 10
        ORDER BY review_count DESC LIMIT ?;`,
        [calories, `%${ingredient_name}%`, user_id, count]
    );

    return rows as any[];
}

export async function getComplexRecipe(count: number, username: string): Promise<any[]> {
    const user_id = Math.abs(crc32.str(username));
    const [rows] = await pool.query<RowDataPacket[]>(
        `select recipe_id, name, count(*)
        from Recipes NATURAL JOIN recipe_ingredient
        GROUP BY recipe_id, name
        HAVING COUNT(*) > 10 and ingredient_id not in (SELECT ingredient_id from user_restriction where user_id = ?)
        LIMIT ?;`
        , [user_id, count]
    );

    return rows as any[];
}

export async function getIngredientsByRecipeId(recipe_id: number, username: string): Promise<Recipe[]> {
    const user_id = Math.abs(crc32.str(username));
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM recipe_ingredient WHERE recipe_id = ? and ingredient_id not in (SELECT ingredient_id from user_restriction where user_id = ?);`,
        [recipe_id, user_id]
    );

    console.log(rows);
    return rows as Recipe[];
}

export async function getCaloriesDiff(): Promise<any[]> {

    // CALL COMPARE_INGREDIENT_USE(@diff);
    // SELECT @diff;
    const [rows] = await pool.query<RowDataPacket[]>(
        `CALL COMPARE_INGREDIENT_USE();`
    );

    console.log(rows[0][0].diff);
    

    return rows[0][0].diff;
}

// export async function getPokemonByPokemonName(pokemonName: string): Promise<Recipe[]> {
//   const queryName = pokemonName.toLowerCase();
//   const sqlQuery = `SELECT * FROM pokemon.pokemon WHERE pokemonName LIKE '%${queryName}%';`;
//   const [rows] = await pool.query(sqlQuery);
//   return rows as Recipe[];
// }

// export async function getPokemonByID(pokemonID: number): Promise<Recipe | undefined> {
//   const sqlQuery = `SELECT * FROM pokemon WHERE pokemonID = ${pokemonID};`;
//   const [rows] = await pool.query<RowDataPacket[]>(sqlQuery);
//   return rows[0] as Recipe;
// }
