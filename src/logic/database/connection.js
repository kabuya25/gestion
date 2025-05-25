"use server"

import mysql from "mysql2/promise";

export async function database() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "kevin",
        password: "test",
        database: "bernair",
    });

    return connection
}

