import { Recipe } from "../../models/entity";
import pool from "../../utils/connection";
import { RowDataPacket } from "mysql2";

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

export async function getRecipeByFilter(filter: any): Promise<any[]> {
    const { count, min_calories, max_calories } = filter;
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Recipes 
     WHERE calories >= ? AND calories <= ?
     LIMIT ?`,
        [min_calories, max_calories, count]
    );

    return rows as any[];
}
