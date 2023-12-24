import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  console.log("Middleware запущен!", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;
  console.log("А вот это пафнейм", pathname);
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const protectedRoutes = ["/cars"];

  if (
    protectedRoutes.some((route) =>
      pathname.startsWith(route.replace(":path*", "")),
    )
  ) {
    if (!token) {
      const url = new URL("/error", request.url);
      url.searchParams.set("message", "Недостаточно прав");
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/cars/:path*"],
};
