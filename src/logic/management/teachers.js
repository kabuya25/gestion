"use server"

import {database} from '../database/connection';
import {check_inputs} from "@/logic/security/inputs";

export const adding_teacher = async (data) => {


    let firstname = data.get('firstname').trim();
    let lastname = data.get('lastname').trim();

    if (firstname.length < 1) {
        return "firstname"
    }

    if (lastname.length < 1) {
        return "lastname"
    }


    const badges = data.get('badges').trim().length > 0 ?  data.get('badges').split(',').map(badge =>  parseInt(badge.trim())) : []

    badges.forEach(badge => {
        if(!parseInt(badge)){
            return false
        }
    })


    firstname = await check_inputs(data.get('firstname').trim()[0].toUpperCase() + data.get('firstname').substring(1).trim().toLowerCase())
    lastname = await check_inputs(data.get('lastname').trim()[0].toUpperCase() + data.get('lastname').substring(1).trim().toLowerCase())


    let session
    try{
        session = await database()
        await session.beginTransaction()
        await session.query(`SELECT discipline_id, name FROM bernair.discipline FOR UPDATE`)
        const [result] = await session.query(`INSERT INTO bernair.teacher(firstname, lastname) VALUES(?, ?)`, [firstname, lastname])
        console.log(result.insertId);

        const teacher_id = result.insertId

        console.log(badges);

            for (const badge of badges) {
                await session.query(`INSERT INTO bernair.teaching(id_teacher, id_discipline) VALUES(?, ?)`, [teacher_id, badge])
            }
        await session.commit();

    } catch (e) {
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

export const editing_teacher = async (data) => {

    let firstname = data.get('firstname').trim();
    let lastname = data.get('lastname').trim();
    const id = data.get('teacher_id').trim();
    const new_badges = data.get('badges').trim().length > 0 ?  data.get('badges').split(",").map(badge =>  parseInt(badge.trim())) : []

    new_badges.forEach(badge => {
        if(!parseInt(badge)){
            return false
        }
    })


    if (firstname.length < 1) {
        return "firstname"
    }

    if (lastname.length < 1) {
        return "lastname"
    }


    firstname = await check_inputs(data.get('firstname').trim()[0].toUpperCase() + data.get('firstname').substring(1).trim().toLowerCase())
    lastname = await check_inputs(data.get('lastname').trim()[0].toUpperCase() + data.get('lastname').substring(1).trim().toLowerCase())


    let session
    try{
        session = await database()
        await session.beginTransaction()
        await session.query(`SELECT * FROM bernair.teacher WHERE teacher.teacher_id=? FOR UPDATE`,[id])
        await session.query(`SELECT * FROM bernair.discipline FOR UPDATE`)
        await session.query(`SELECT * FROM bernair.teaching WHERE id_teacher=? FOR UPDATE`,[id])
        await session.query(`UPDATE bernair.teacher SET firstname=?, lastname=? WHERE teacher_id=?`, [firstname, lastname, id])

        const [result] = await session.query(`SELECT id_discipline FROM bernair.teaching WHERE id_teacher=?`,[id])
        const current_discipline = result.map((list) => list.id_discipline)
        const deleting_discipline_id = current_discipline.filter(discipline => !new_badges.includes(discipline))

        if (deleting_discipline_id.length > 0) {
            for (const discipline_id of deleting_discipline_id) {
                await session.query(`DELETE FROM bernair.teaching WHERE id_teacher=? AND id_discIpline=?`,[id, discipline_id])
            }
        }

        const adding_discipline_id = new_badges.filter(discipline => !current_discipline.includes(discipline))

        if (adding_discipline_id.length > 0) {
            for (const discipline_id of adding_discipline_id) {
                await session.query(`INSERT INTO bernair.teaching(id_teacher, id_discipline) VALUES(?, ?)`,[id, discipline_id])
            }
        }

        await session.commit()
    } catch (e) {
        console.log(e)
        await session.rollback()
        return false
    } finally {
        await session.end();

    }

    return true
}

export const get_teachers = async () => {
    let session

    try{
        session = await database()
        const [rows] = await session.query(`
            select
                t.teacher_id,
                TRIM(BOTH "\'" FROM t.firstname) AS firstname,
                TRIM(BOTH "\'" FROM t.lastname) AS lastname,
                GROUP_CONCAT(TRIM(BOTH "\'" FROM d.name) ORDER BY d.name SEPARATOR  ',') AS disciplines
            FROM bernair.teacher as t
            LEFT JOIN bernair.teaching
                ON t.teacher_id = teaching.id_teacher
            LEFT JOIN bernair.discipline AS d
                ON teaching.id_discipline = d.discipline_id
            GROUP BY t.lastname
        `,[])

        return rows
    } catch (e) {
        return false
    }
}

export const get_teacher = async (id) => {
    const teacher_id = id

    if(!parseInt(teacher_id)){
        return false
    }
    let session

    try{
        session = await database()
        const [rows] = await session.query(`
            select
                t.teacher_id,
                TRIM(BOTH "\'" FROM t.firstname) AS firstname,
                TRIM(BOTH "\'" FROM t.lastname)  AS lastname,
                GROUP_CONCAT(CONCAT('{"discipline_id":"', TRIM(BOTH "\'" FROM d.discipline_id),'","name":"',
                                    TRIM(BOTH "\'" FROM d.name),'"}') ORDER BY d.name SEPARATOR  '@') AS disciplines
            FROM bernair.teacher as t
            LEFT JOIN bernair.teaching
                ON t.teacher_id = teaching.id_teacher
            LEFT JOIN bernair.discipline AS d
                ON teaching.id_discipline = d.discipline_id
            WHERE t.teacher_id = ?
            GROUP BY t.teacher_id
        `,[teacher_id])

        console.log(rows[0])
        return rows[0]
    } catch (e) {
        console.log(e)
        return false
    }
}

export const delete_teacher = async (id) => {
    const teacher_id = id

    if(!parseInt(teacher_id)){
        return false
    }

    let session

    try{
        session = await database()
        await session.query(`DELETE FROM bernair.teacher WHERE teacher_id=?`,[teacher_id])
    } catch (e) {
        console.log(e)
        return false
    } finally {
        await session.end()
    }

    return true
}