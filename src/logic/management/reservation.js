"use server"

import {getId} from "@/logic/security/sessions";
import {database} from "@/logic/database/connection";

export const get_reservations = async () => {
    const client_id = await getId()

    if(!parseInt(client_id)){
        return "invalid"
    }

    let session

    try{
        session = await database()
        const [rows] = await session.query(`
            SELECT
                reservation_id,
                FROM_UNIXTIME(time / 1000, '%H:%i %d/%m/%Y') AS "starting",
                FROM_UNIXTIME(time / 1000 + class_length * 60, '%H:%i %d/%m/%Y') AS ending,
                TRIM(BOTH "\'" FROM room.name) as room,
                TRIM(BOTH "\'" FROM discipline.name) AS discipline,
                CONCAT(SUBSTRING(teacher.lastname,2,1), ".", SUBSTRING(teacher.firstname,2,1)) AS teacher
            FROM bernair.reservation
             JOIN bernair.classes
                  ON reservation.id_classes = classes.class_id
            JOIN bernair.room 
                ON room.room_id = classes.id_room
            JOIN bernair.discipline 
                ON discipline.discipline_id = classes.id_discipline
            JOIN bernair.teacher
                 ON teacher.teacher_id = classes.id_teacher
            WHERE reservation.id_client = ?
            ORDER BY classes.time
        `,[client_id])

        await session.commit()
        return rows

    } catch (e) {
        console.log(e)
        await session.rollback()
        return false
    } finally {
        await session.end()
    }
}


export const delete_reservation = async (id_reservation) => {
    const reservation_id = id_reservation
    const client_id = await getId()

    console.log("client_cancel_class", client_id)

    if(!parseInt(reservation_id) || !parseInt(client_id)){
        return false
    }

    let session

    try {
        session = await database()
        await session.beginTransaction()
        await session.query(`DELETE FROM bernair.reservation WHERE reservation_id=? AND id_client=?`, [reservation_id, client_id])

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