"use server"

import {database} from '../database/connection';
import {check_inputs} from "@/logic/security/inputs";
import {isAdmin} from "@/logic/security/sessions";

export const adding_discipline = async (data) => {
    if(!isAdmin()){
        return false
    }


    if (data.get('name').trim().length < 1) {
        return "empty"
    }

    const name = await check_inputs(data.get('name').trim()[0].toUpperCase() + data.get('name').substring(1).trim().toLowerCase())


    let session
    try{
        session = await database()
        await session.beginTransaction()
        await session.query("LOCK TABLES discipline WRITE")
        await session.query(`INSERT INTO bernair.discipline(name) VALUES(?)`, [name])
        await session.commit();

    } catch (e) {
        console.log("error!")
        console.log(e)
        await session.rollback()
        if (e.code === "ER_DUP_ENTRY") {
            return "discipline exists"
        }

        return false

    } finally {
        session.query("UNLOCK TABLES")
        session.end();
    }

    return true
}

export const editing_discipline = async (data) => {
    if(!isAdmin()){
        return false
    }


    console.log(data);
    if (data.get('name').trim().length < 1) {
        return "empty"
    }

    if(!parseInt(data.get('discipline_id'))){
        return false
    }

    const name =  await check_inputs(data.get('name').trim()[0].toUpperCase() + data.get('name').substring(1).trim().toLowerCase())
    const discipline_id = data.get('discipline_id')

    let session
    try{
        session = await database()
        await session.beginTransaction()
        session.query("LOCK TABLES discipline WRITE")
        await session.query(`UPDATE bernair.discipline SET name=? WHERE discipline_id=?`, [name, discipline_id])
        await session.commit();

    } catch (e) {
        console.log(e)
        await session.rollback()
        if (e.code === "ER_DUP_ENTRY") {
            if (e.sqlMessage.includes("discipline")){
                return "discipline exists"
            }
        }

        return false

    } finally {
        session.query("UNLOCK TABLES")
        session.end();
    }

    return true
}

export const deleting_discipline = async (id) => {
    if(!isAdmin()){
        return false
    }


    if(!parseInt(id)){
        return false
    }

    let session
    try{
        session = await database()
        await session.beginTransaction()
        session.query("LOCK TABLES discipline WRITE")
        await session.query(`DELETE FROM bernair.discipline WHERE discipline_id=?`, [id])
        await session.commit();

    } catch (e) {
        await session.rollback()
        console.log(e)
        return false
    } finally {
        session.query("UNLOCK TABLES")
        session.end();
    }

    return true
}

export const get_disciplines = async () => {
    if(!isAdmin()){
        return false
    }


    let session

    try{
        session = await database()
        const [row] = await session.query(`SELECT discipline_id, TRIM(BOTH "\'" FROM name) AS name FROM bernair.discipline ORDER BY name`)

        return row
    } catch (e) {
        console.log(e)
        return false
    } finally {
        await session.end()
    }
}

export const get_discipline_list_teacher = async (id) => {
    if(!isAdmin()){
        return false
    }


    const teacher_id = id

    if(!parseInt(data.get(teacher_id))){
        return false
    }
    let session

    try{
        session = await database()
        const [rows] = await session.query(`
            select
                d.discipline_id,
                TRIM( BOTH "\" FROM d.name) AS name
            FROM bernair.teacher as t
            LEFT JOIN bernair.teaching
                ON t.teacher_id = teaching.id_teacher
            LEFT JOIN bernair.discipline AS d
                ON teaching.id_discipline = d.discipline_id
            WHERE t.teacher_id = ?
        `,[teacher_id])

        return rows
    } catch (e) {
        console.log(e)
        return false
    }
}
