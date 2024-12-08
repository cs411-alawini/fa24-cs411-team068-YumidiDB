import { Recipe } from "../../models/entity";
import pool from "../../utils/connection";
import { RowDataPacket } from "mysql2";
import crc32 from 'crc-32';


export async function checkUniqueUsername(username: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Users WHERE user_name = ?`,
        [username]
    );
    return rows.length === 0;
}

export async function registerUser(user: any): Promise<any> {
    const { username, password, } = user;
    // integer user_id auto_increment primary key
    const user_id = Math.abs(crc32.str(username));
    const [rows] = await pool.query<RowDataPacket[]>(
        `INSERT INTO Users (user_id, user_name, hashed_password) VALUES (?, ?, ?)`,
        [user_id, username, password]
    );
}

export async function checkUserExists(username: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Users WHERE user_name = ?`,
        [username]
    );
    return rows.length > 0;
}

export async function getHashedPasswordByUsername(username: string): Promise<any> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT hashed_password FROM Users WHERE user_name = ?`,
        [username]
    );
    return rows[0];
}


export async function searchIgredientName(ingredient_name: string): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT ingredient_name FROM Ingredients WHERE ingredient_name LIKE ?`,
        [`%${ingredient_name}%`]
    );

    return rows as any[];
}

export async function checkIngredientExists(ingredient_name: string): Promise<any> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM Ingredients WHERE ingredient_name LIKE ?`,
        [`${ingredient_name}\r`]
    );
    // console.log(rows);
    return rows.length === 1;
}

export async function hasUserAddRestrictedIngredient(username: string, ingredient_name: string): Promise<any> {
    // const username = req.session.user.user_name;
    const user_id = Math.abs(crc32.str(username));

    const ingredient_id_arr = await pool.query<RowDataPacket[]>(
        `SELECT ingredient_id FROM Ingredients WHERE ingredient_name LIKE ?`,
        [`${ingredient_name}\r`]
    );

    const ingredient_id = ingredient_id_arr[0][0].ingredient_id;

    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM user_restriction 
        WHERE user_id = ? AND ingredient_id = ?`,
        [user_id, ingredient_id]
    );
    return rows.length === 1;
}

export async function fetchIngredientbyUserName(username: string): Promise<any[]> {
    const user_id = Math.abs(crc32.str(username));
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT ingredient_id FROM Ingredients 
        NATURAL JOIN user_restriction 
        WHERE user_id = ?`,
        [user_id]
    );

    // get ingredient_names by ingredient_id
    const ingredient_id_arr = rows.map((row) => row.ingredient_id);
    const ingredient_name_arr = await pool.query<RowDataPacket[]>(
        `SELECT ingredient_name FROM Ingredients WHERE ingredient_id IN (?)`,
        [ingredient_id_arr]
    );
    console.log(ingredient_name_arr);

    // const ingredient_names = ingredient_name_arr[0].map((row) => row.ingredient_name.slice(0, -2));
    const ingredient_names = ingredient_name_arr[0].map((row) => ({"ingredient_name": row.ingredient_name.slice(0, -1)}));

    console.log(ingredient_names);
    return rows as any[];
}

export async function addIngredient(username: string, ingredient_name: string): Promise<any> {
    const user_id = Math.abs(crc32.str(username));
    const ingredient_id_arr = await pool.query<RowDataPacket[]>(
        `SELECT ingredient_id FROM Ingredients WHERE ingredient_name LIKE ?`,
        [`${ingredient_name}\r`]
    );

    const ingredient_id = ingredient_id_arr[0][0].ingredient_id;

    const id = Math.abs(crc32.str(`${user_id}${ingredient_id}`));

    const [rows] = await pool.query<RowDataPacket[]>(
        `INSERT INTO user_restriction (id, user_id, ingredient_id) VALUES (?, ?, ?)`,
        [id, user_id, ingredient_id]
    );
    return rows;
}

export async function deleteIngredient(username: string, ingredient_name: string): Promise<any[]> {
    const user_id = Math.abs(crc32.str(username));
    const ingredient_id_arr = await pool.query<RowDataPacket[]>(
        `SELECT ingredient_id FROM Ingredients WHERE ingredient_name LIKE ?`,
        [`${ingredient_name}\r`]
    );

    const ingredient_id = ingredient_id_arr[0][0].ingredient_id;

    const [rows] = await pool.query<RowDataPacket[]>(
        `DELETE FROM user_restriction 
        WHERE user_id = ? AND ingredient_id = ?`,
        [user_id, ingredient_id]
    );
    return rows;

}

