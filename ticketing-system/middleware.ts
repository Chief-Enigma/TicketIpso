import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsealData } from "iron-session";

const sessionCookieName = "ts.sid";
type SessionData = { user?: { id: number; role: "ADMIN" | "USER" } };

async function hasValidSession(req: NextRequest) {
  const cookie = req.cookies.get(sessionCookieName)?.value;
  if (!cookie) return false;

  const password = process.env.SESSION_PASSWORD;
  if (!password) return false;

  try {
    const data = (await unsealData(cookie, { password })) as SessionData;
    return Boolean(data?.user?.id);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") return NextResponse.next();

  if (pathname.startsWith("/login")) return NextResponse.next();

  if (pathname.startsWith("/api/init")) return NextResponse.next();

  const ok = await hasValidSession(request);
  if (!ok) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt|assets|images|static).*)",
  ],
};