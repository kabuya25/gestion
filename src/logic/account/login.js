"use server"

import { cookies } from 'next/headers'

import {database} from '../database/connection'
import { getSession } from "@/logic/security/sessions"
import {hash, compare} from "@/logic/security/hashing"


export async function add_user(data){
    const user_info = {
        firstName: data.get("first-name").trim(),
        lastName: data.get("last-name").trim(),
        email: data.get("email").trim(),
        password: data.get("password").trim(),
        phone: data.get("phone").trim(),
        about: data.get("about").trim(),
    }

    for (const [key, value] of Object.entries(user_info)) {
        if(isEmpty(value) && key !== "about") {
            return key
        }
    }

    if(user_info.phone.length < 7 || user_info.phone.length > 15) {
        return "phone length"
    }

    user_info.phone = data.get("country").trim() + data.get("phone").trim().substring(1, data.get("phone").trim().length)
    user_info.password = hash(user_info.password)

    let session
    try{
        session = await database()
        await session.query(
            `INSERT INTO bernair.client (firstname, lastname, email, password, phone, description)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [user_info.firstName, user_info.lastName, user_info.email, user_info.password, user_info.phone, user_info.about]
        );
    } catch (e) {
        console.log(e);
        if (e.code === "ER_DUP_ENTRY") {
            if (e.sqlMessage.includes("client.email")){
                return "email exists"
            }

            if (e.sqlMessage.includes("client.phone")){
                return "phone exists"
            }
        }
        return false
    } finally {
        if (session) {
            await session.end()
        }
    }


    return true
}

export async function login(data){
    const user_info = {
        email: data.get("email").trim(),
        password: data.get("password").trim(),
    }

    console.log(user_info)

    let session

    try{
        session = await database()
        const [rows] = await session.query("SELECT client_id, email, password FROM bernair.client WHERE email=? LIMIT 1", [user_info.email])

        console.log(rows)
        console.log(user_info.password)

        if (rows.length === 0){
            return "credentials"
        }



        if (!compare(user_info.password, rows[0].password)){
            return "credentials"
        }

        const cookie = await cookies(); // from "next/headers"
        const my_session = await getSession(cookie)


        my_session.cardinal.user = {
            id: rows[0].client_id
        }
        await my_session.save();



        return true
    } catch (e) {
        console.log(e)
        return false
    } finally {
        if (session) {
            session.end()
        }
    }
}


export const user_sign_off = async () => {
    try{
        const cookie = await cookies(); // from "next/headers"
        const my_session = await getSession(cookie);
        delete my_session.cardinal.user
        await my_session.save();
        return true
    } catch (e) {
        return false
    }

}

export const admin_sign_off = async () => {
    try{
        const cookie = await cookies(); // from "next/headers"
        const my_session = await getSession(cookie);
        delete my_session.cardinal.admin
        await my_session.save();
        return true
    } catch (e) {
        return false
    }

}

export async function admin_login(data){
    try{
        const user_info = {
            username: data.get("user").trim(),
            password: data.get("password").trim(),
        }
        console.log(user_info)
        console.log(user_info.username !== process.env.LOGIN.trim())

        if(user_info.username !== process.env.LOGIN || user_info.password !== process.env.ADMIN_PASSWORD) {
            return "credentials"
        }

        const cookie = await cookies(); // from "next/headers"
        const my_session = await getSession(cookie);
        my_session.cardinal.admin = {
            connected:true
        }
        await my_session.save();

        return true
    } catch (e) {
        return false
    }

}

export const is_connected = async () => {
    const cookie = await cookies()
    const my_session = await getSession(cookie)



    let session
    try{

        session = await database()
        // console.log("is logged in: " + my_session.user.id)
        const [rows] = await session.query(`SELECT client_id FROM bernair.client WHERE client_id=? LIMIT 1`, [my_session.user.id])

        console.log(rows)

        if(rows.length === 1) {
            return true
        }

        return false
    } catch (e) {
        // console.log(e)
        return false
    } finally {
        await session.end()
    }
}

const isEmpty = (data) => {
    return !data;
}


