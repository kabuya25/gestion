import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";

 const sessionOptions = {
    password: "atKISqkboZadJQ0v6fns62GeRHJWTwp1",
    cookieName: 'cardinal',
    cookieOptions: {
        secure: false,
    },
}

 export default  async function middleware(req) {
    const res = NextResponse.next();

    const session = await getIronSession(req, res, sessionOptions);

     if (req.nextUrl.pathname.startsWith("/")) {
         return NextResponse.redirect(new URL("/login", req.url));
     }

    if (!session.cardinal?.user && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

     if (session.cardinal?.user && (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/registration"))) {
         return NextResponse.redirect(new URL("/dashboard/classes", req.url));
     }
     console.log(session)
     if (!session.cardinal?.admin && req.nextUrl.pathname.startsWith("/admin/dashboard")) {

         return NextResponse.redirect(new URL("/", req.url));
     }

     if (session.cardinal?.admin && req.nextUrl.pathname.startsWith("/admin/login")) {
         return NextResponse.redirect(new URL("/admin/dashboard/classes", req.url));
     }


    return res;

}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/registration",
        "/admin/dashboard/:path*",
        "/admin/login",
        "/"
    ], // Protect everything under /dashboard
};