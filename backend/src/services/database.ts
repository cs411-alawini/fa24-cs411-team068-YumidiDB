import { Recipe } from "../models/entity";
import pool from './connection';
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
