import {getIronSession} from "iron-session"
import {cookies} from "next/headers";


export function getSession(cookies) {
    const sessionOptions = {
        password: "atKISqkboZadJQ0v6fns62GeRHJWTwp1",
        cookieName: "cardinal",
        cookieOptions: {
            secure: false,
        },
    }
    return getIronSession(cookies, sessionOptions)
}


export const getId = async () => {
    const cookie = await cookies()
    const my_session = await getSession(cookie)
    return my_session.cardinal?.user.id
}


export const isAdmin = async () => {
    const cookie = await cookies()
    const my_session = await getSession(cookie)
    return my_session.cardinal?.admin.connected
}

