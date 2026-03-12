import { getToken, GetTokenParams } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  console.log("Middleware запущен!", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  let params: GetTokenParams = {
    req: request,
    secret: process.env.AUTH_SECRET ?? "secret"
  };

  console.log(params, "Это объект params");
  console.log(params.cookieName, "Это cookieName ДО");

  if (process.env.NODE_ENV === "production") {
    params = {
      ...params,
      cookieName: "__Secure-authjs.session-token"
    };
  }

  console.log(params.cookieName, "Это cookieName ПОСЛЕ");

  const token = await getToken(params);

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
