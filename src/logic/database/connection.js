"use server"

import mysql from "mysql2/promise";

export async function database() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_URL,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    });

    return connection
}

