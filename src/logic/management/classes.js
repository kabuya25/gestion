"use server"

import {database} from '../database/connection'
import {get_discipline_list_teacher} from "@/logic/management/Discipline";
import {getId, isAdmin} from "@/logic/security/sessions";

export const get_classes = async () => {
    let session

    if(!isAdmin()){
        return false
    }

    try{
        session = await database()
        const [rows] = await session.query(`
            SELECT
                class_id,
                FROM_UNIXTIME(time / 1000 + class_length * 60, '%H:%i %d/%m/%Y') AS ending,
                FROM_UNIXTIME(time / 1000, '%H:%i %d/%m/%Y') AS time, 
                TRIM(BOTH "\'" FROM room.name) as room,
                TRIM( BOTH "\'" FROM discipline.name) AS discipline,
                CONCAT(TRIM(BOTH "\'" FROM teacher.lastname), " ",
                       TRIM(BOTH "\'" FROM teacher.firstname)) AS teacher
            FROM bernair.classes
            JOIN bernair.room 
                ON room.room_id = classes.id_room
            JOIN bernair.discipline 
                ON discipline.discipline_id = classes.id_discipline
            JOIN bernair.teacher
                 ON teacher.teacher_id = classes.id_teacher
            ORDER BY classes.time
        `)

        return rows
    } catch (e) {
        console.log(e)
        await session.rollback()
        return false
    } finally {
        await session.end()
    }
}

export const get_classes_join = async () => {
    const client_id = await getId()

    if(!parseInt(client_id)){
        return false
    }

    let session

    try{
        session = await database()
        const [rows] = await session.query(`
            SELECT
                class_id,
                FROM_UNIXTIME(time / 1000 + class_length * 60, '%H:%i %d/%m/%Y') AS ending,
                FROM_UNIXTIME(time / 1000, '%H:%i %d/%m/%Y') AS time,
                TRIM(BOTH "\'" FROM room.name) as room,
                TRIM(BOTH "\'" FROM discipline.name) AS discipline,
                CONCAT(TRIM(BOTH "\'" FROM teacher.lastname), " ",
                       TRIM(BOTH "\'" FROM teacher.firstname)) AS teacher,
                (reservation.id_client = ?) AS is_joined
            FROM bernair.classes
            JOIN bernair.room
                ON room.room_id = classes.id_room
            JOIN bernair.discipline
                ON discipline.discipline_id = classes.id_discipline
            JOIN bernair.teacher
                 ON teacher.teacher_id = classes.id_teacher
            LEFT JOIN bernair.reservation
                ON classes.class_id = reservation.id_classes
            ORDER BY classes.time
        `, [client_id])

        return rows
    } catch (e) {
        console.log(e)
        await session.rollback()
        return false
    } finally {
        await session.end()
    }
}

export const get_class = async (id) => {
    const class_id = id

    if(!parseInt(class_id)){
        return false
    }

    let session

    try{
        session = await database()

        const [rows] = await session.query(`
            SELECT
                class_id,
                FROM_UNIXTIME(time / 1000, '%Y-%m-%dT%H:%i') AS time,
                class_length,
                room.room_id AS room_id,
                room.name as room,
                discipline.discipline_id AS discipline_id,
                discipline.name AS discipline,
                teacher.teacher_id AS teacher_id,
                CONCAT(TRIM(BOTH "\'" FROM teacher.lastname), " ",
                       TRIM(BOTH "\'" FROM teacher.firstname)) AS teacher
            FROM bernair.classes
            JOIN bernair.room 
                ON classes.id_room = room.room_id
            JOIN bernair.teacher
                 ON classes.id_teacher = teacher.teacher_id
            JOIN bernair.discipline
                 ON classes.id_discipline = discipline.discipline_id
            WHERE class_id = ?
            LIMIT 1
        `,[class_id])

        const room_teachers_list = await check_enough_data()
        const disciplines = await get_discipline_list_teacher(rows[0].teacher_id)

        return {
            possible_data:{
                ...room_teachers_list,
                disciplines: disciplines,
            },
            selected_data:rows[0]
        }


    } catch (e) {
        console.log(e)
        await session.rollback()
        return true
    } finally {
        await session.end()
    }

}

// export const get_classes_client = async () => {
//     const client_id = await getId()
//
//     if(!parseInt(client_id)){
//         return "invalid"
//     }
//
//     let session
//
//     try{
//         session = await database()
//         const [rows] = await session.query(`
//             SELECT
//                 reservation_id,
//                 FROM_UNIXTIME(time / 1000, '%H:%i %d/%m/%Y') AS "starting",
//                 FROM_UNIXTIME(time / 1000 + class_length * 60, '%H:%i %d/%m/%Y') AS ending,
//                 room.name as room,
//                 discipline.name AS discipline,
//                 CONCAT(SUBSTRING(teacher.lastname,1,1), ".", SUBSTRING(teacher.firstname,1,1)) AS teacher
//             FROM bernair.reservation
//              JOIN bernair.classes
//                   ON reservation.id_classes = classes.class_id
//             JOIN bernair.room
//                 ON room.room_id = classes.id_room
//             JOIN bernair.discipline
//                 ON discipline.discipline_id = classes.id_discipline
//             JOIN bernair.teacher
//                  ON teacher.teacher_id = classes.id_teacher
//             WHERE reservation.id_client = ?
//             ORDER BY classes.time
//         `,[client_id])
//
//         await session.commit()
//         return rows
//
//     } catch (e) {
//         console.log(e)
//         await session.rollback()
//     } finally {
//         await session.end()
//     }
// }

export const check_enough_data = async () => {
    if(!isAdmin()){
        return false
    }



    let session
    try{
        session = await database()
        await session.beginTransaction()

        const [available_room] = await session.query(`SELECT room_id, name FROM bernair.room FOR UPDATE`, [])

        if(available_room.length < 1){
            return "no room"
        }

        const [possible_classes] = await session.query(`
            SELECT
                teacher.teacher_id,
                CONCAT(TRIM(BOTH "\'" FROM teacher.lastname) , " " , TRIM(BOTH "\'" FROM teacher.firstname)) AS teacher
            FROM bernair.teaching
            JOIN bernair.teacher  
                ON teacher.teacher_id = teaching.id_teacher
            GROUP BY teacher_id
            FOR UPDATE
            `, [])

        if(possible_classes.length < 1){
            return "no classes"
        }

        return {
            available_rooms: available_room,
            possible_classes:possible_classes
        }

    } catch (e) {
        console.log(e)
        await session.rollback()
        return false
    } finally {
        await session.commit()
        await session.end()
    }

    return true

}

export const add_class = async (data) => {
    if(!isAdmin()){
        return false
    }



    const room_id = parseInt(data.get("room_id"))
    const teacher_id = parseInt(data.get("teacher_id"))
    const discipline_id = parseInt(data.get("discipline_id"))
    const datetime = parseInt(data.get("datetime"))
    const length = parseInt(data.get("length"))

    const class_data = {
        room_id: room_id,
        teacher_id: teacher_id,
        discipline_id: discipline_id,
        datetime: datetime,
        length: length,
    }

    for(const current_class of Object.values(class_data)) {
        if(!Number.isInteger(current_class)){
            return "invalid"
        }
    }

    let session



    try{
        session = await database()
        await session.beginTransaction()
        await session.query(`SELECT * FROM bernair.teacher FOR UPDATE`, [])
        await session.query(`SELECT * FROM bernair.discipline FOR UPDATE`, [])
        await session.query(`SELECT * FROM bernair.room FOR UPDATE`, [])

        const [overlaping] = await session.query(`
            SELECT 
                classes.class_id
            FROM bernair.classes 
            JOIN bernair.room 
                ON classes.id_room = room.room_id
            WHERE 
                ((time<=? AND (time + classes.class_length * 60000)>=?) OR (time<=? AND (time + classes.class_length * 60000)>=?)) AND room.room_id=? LIMIT 1`,
            [
                class_data.datetime,
                class_data.datetime,
                class_data.datetime + class_data.length * 60000,
                class_data.datetime + class_data.length * 60000,
                class_data.room_id
            ])

        console.log(overlaping)

        if(overlaping.length > 0){
            session.rollback()
            return "overlap"
        }

        await session.query(
            `INSERT INTO bernair.classes(time,class_length,id_discipline,id_teacher,id_room) VALUES(?,?,?,?,?)`,
            [class_data.datetime, class_data.length, class_data.discipline_id, class_data.teacher_id, class_data.room_id]
        )

        session.commit()

    } catch (e) {
        console.log(e)
        session.rollback()
        return false
    } finally {

        session.end()
    }

    return true

}

export const edit_class = async (data) => {
    if(!isAdmin()){
        return false
    }



    const class_id = parseInt(data.get("class_id"))
    const room_id = parseInt(data.get("room_id"))
    const teacher_id = parseInt(data.get("teacher_id"))
    const discipline_id = parseInt(data.get("discipline_id"))
    const datetime = parseInt(data.get("datetime"))
    const length = parseInt(data.get("length"))

    const class_data = {
        class_id:class_id,
        room_id: room_id,
        teacher_id: teacher_id,
        discipline_id: discipline_id,
        datetime: datetime,
        length: length,
    }

    console.log(class_data)


    for(const current_class of Object.values(class_data)) {
        if(!Number.isInteger(current_class)){
            return "invalid"
        }
    }

    let session



    try{
        session = await database()
        await session.beginTransaction()
        await session.query(`SELECT * FROM bernair.teacher FOR UPDATE`, [])
        await session.query(`SELECT * FROM bernair.discipline FOR UPDATE`, [])
        await session.query(`SELECT * FROM bernair.room FOR UPDATE`, [])

        const [overlaping] = await session.query(`
            SELECT 
                classes.class_id
            FROM bernair.classes 
            JOIN bernair.room 
                ON classes.id_room = room.room_id
            WHERE 
                ((time<=? AND (time + classes.class_length * 60000)>=?) OR (time<=? AND (time + classes.class_length * 60000)>=?)) AND room.room_id=? AND classes.class_id!= ? LIMIT 1`,
            [
                class_data.datetime,
                class_data.datetime,
                class_data.datetime + class_data.length * 60000,
                class_data.datetime + class_data.length * 60000,
                class_data.room_id,
                class_data.class_id
            ])

        console.log(overlaping)

        if(overlaping.length > 0){
            session.rollback()
            return "overlap"
        }

        await session.query(
            `UPDATE bernair.classes SET time=?,class_length=?,id_discipline=?,id_teacher=?,id_room=? WHERE class_id=?`,
            [class_data.datetime, class_data.length, class_data.discipline_id, class_data.teacher_id, class_data.room_id, class_data.class_id]
        )

        session.commit()

    } catch (e) {
        console.log(e)
        session.rollback()
        return false
    } finally {

        session.end()
    }

    return true

}

export const delete_class = async (id) => {
    if(!isAdmin()){
        return false
    }


    const class_id = id

    if(!parseInt(class_id)){
        return false
    }

    let session

    try {
        session = await database()
        await session.query(`DELETE FROM bernair.classes WHERE class_id=?`, [class_id])
        await session.commit()
        return true
    } catch (e) {
        console.log(e)
        await session.rollback()
        return false
    } finally {
        await session.end()
    }
}

export const join_class = async (class_id) => {
    const id_client = await getId()
    const id_class = class_id

    if(!parseInt(id_class) || !parseInt(id_client)){
        return false
    }

    let session

    try{
        session = await database()

        await session.beginTransaction()
        const [is_reservation] = await session.query(`SELECT * FROM bernair.reservation WHERE id_classes=? AND id_client=? LIMIT 1`, [id_class, id_client])

        if(is_reservation.length > 0){
            await session.query(`DELETE FROM bernair.reservation WHERE id_classes=? AND id_client=?`, [id_class, id_client])
        } else {
            await session.query(`INSERT INTO bernair.reservation(id_client, id_classes) VALUES(?,?)`,[id_client,class_id])
        }

        await session.commit()
        return true

    }catch (e) {
        console.log(e)
        await session.rollback()
        return false
    } finally {
        await session.end()
    }

}

// export const client_cancel_class = async (id_client, id_reservation) => {
//     const reservation_id = id_reservation
//     const client_id = getId()
//
//     console.log("client_cancel_class", client_id)
//
//     if(!parseInt(reservation_id)){
//         return false
//     }
//
//     let session
//
//     try {
//         session = await database()
//         await session.beginTransaction()
//         await session.query(`DELETE FROM bernair.reservation WHERE reservation_id=? AND id_client=?`, [reservation_id, client_id])
//
//         await session.commit()
//         return true
//     } catch (e) {
//         console.log(e)
//         await session.rollback()
//         return false
//     } finally {
//         await session.end()
//     }
//
//
// }