"use server"

import {database} from '../database/connection';

import {check_inputs} from "@/logic/security/inputs";
import {isAdmin} from "@/logic/security/sessions";



export const get_rooms = async () => {
    if(!isAdmin()){
        return false
    }


    let session

    try{
        session = await database()

        const [rows] = await session.query(`SELECT room_id, TRIM(BOTH "\'" FROM name) AS name, capacity FROM bernair.room`,[])
        return rows
    } catch (e) {
        console.log(e)
        return false
    } finally {
        await session.end()
    }

    return true
}

export const get_room = async (id) => {
    if(!isAdmin()){
        return false
    }


    const room_id = id

    if(!parseInt(room_id)){
        return false
    }

    let session

    try{
        session = await database()
        const [rows] = await session.query(`SELECT room_id, TRIM(BOTH "\'" FROM name) AS name, capacity FROM bernair.room WHERE room_id=?`, [room_id])

        return rows[0]
    }catch (e) {
        console.log(e)
        return false
    } finally {
        await session.end()
    }
}

export const adding_room  = async (data) => {
    if(!isAdmin()){
        return false
    }


    console.log(data);

    if (data.get('name').trim().length < 1) {
        return "empty"
    }

    if(!parseInt(data.get('capacity'))){
        return "NaN"
    }

    const name = await check_inputs(data.get('name').trim()[0].toUpperCase() + data.get('name').substring(1).trim().toLowerCase())
    const capacity = data.get('capacity')

    let session

    try{
        session = await database()

        await session.query(`INSERT INTO bernair.room(name, capacity) VALUES(?, ?)`,[name, capacity])
    } catch (e) {
        console.log(e)
        if (e.code === "ER_DUP_ENTRY") {
            return "room exists"
        }

        if (e.code === "ER_WARN_DATA_OUT_OF_RANGE") {
            return "big"
        }

        return false
    } finally {
        await session.end()
    }

    return true
}

export const edit_room = async (data) => {
    if(!isAdmin()){
        return false
    }

    if (data.get('name').trim().length < 1) {
        return "empty"
    }

    if(!parseInt(data.get('capacity'))){
        return "NaN"
    }

    if(!parseInt(data.get("id"))){
        return false
    }

    const room_id = data.get('id')
    const name = await check_inputs(data.get('name').trim()[0].toUpperCase() + data.get('name').substring(1).trim().toLowerCase())
    const capacity = data.get('capacity')

    let session

    try{
        session = await database()
        await session.query(`UPDATE bernair.room SET name=?, capacity=? WHERE room_id=?`,[name, capacity, room_id])
    } catch (e) {
        console.log(e)
        if (e.code === "ER_DUP_ENTRY") {
            return "room exists"
        }

        if (e.code === "ER_WARN_DATA_OUT_OF_RANGE") {
            return "big"
        }

        return false
    } finally {
        await session.end()
    }

    return true
}

export const delete_room = async (id) => {
    if(!isAdmin()){
        return false
    }

    const room_id = id

    if(!parseInt(room_id)){
        return false
    }

    let session

    try{
        session = await database()
        await session.query(`DELETE FROM bernair.room WHERE room_id=?`, [room_id])
    }catch (e) {
        console.log(e)
        return false
    } finally {
        session.end()
    }

    return true
}

