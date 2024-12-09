import { Recipe } from "../../models/entity";
import pool from "../../utils/connection";
import { RowDataPacket } from "mysql2";
import crc32 from "crc-32";

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

export async function getRecipeByFilter(
    filter: any,
    username: string
): Promise<any[]> {
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

export async function getAvgRating(): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT
            recipe_id, name, AVG(rating)
        FROM
            Reviews NATURAL JOIN Recipes
        GROUP BY
            recipe_id
        LIMIT 15;`
    );
    console.log(rows);

    return rows as any[];
}

export async function getRecipeWithinDate(
    start_date: string,
    end_date: string,
    count: number
): Promise<any[]> {
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
        LIMIT ?;`,
        [start_date, end_date, count]
    );

    return rows as any[];
}
