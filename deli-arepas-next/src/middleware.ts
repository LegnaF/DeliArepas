import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("session_token")?.value;

  const { pathname } = request.nextUrl;

  /*
   * ADMIN
   */
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * CLIENTE
   */
  if (pathname.startsWith("/cliente")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * EMPLEADO
   *
   * Se permite que /empleado/pedidos
   * cargue correctamente.
   */
  if (pathname.startsWith("/empleado")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cliente/:path*",
    "/empleado/:path*",
  ],
};