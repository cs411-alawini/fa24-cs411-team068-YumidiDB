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


