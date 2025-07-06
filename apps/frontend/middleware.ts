import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next|static|favicon.ico|login|signup|verify|$).*)",
  ],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  // If user is NOT logged in, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
// export async function middleware(req:NextRequest) {
//     const token = req.cookies.get('accessToken')?.value;
//     const url = req.nextUrl;

//     if(token &&
//         (url.pathname.startsWith('/login') ||
//       url.pathname.startsWith('/signup') ||
//       url.pathname.startsWith('/verify') ||
//       url.pathname === '/')
//     ) {
//         return NextResponse.redirect(new URL('/dashboard',req.url));
//     }

//     if (!token && url.pathname.startsWith('/dashboard')) {
//         return NextResponse.redirect(new URL('/login',req.url));
//     }
//     return NextResponse.next();
// }
