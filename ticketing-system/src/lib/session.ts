import { cookies } from "next/headers";
import { getIronSession, type IronSession, type SessionOptions } from "iron-session";

export const sessionCookieName = "ts.sid"; // TicketSystem session id

export type SessionUser = { id: number; role: "ADMIN" | "USER" };
export type AppSession = IronSession<{ user?: SessionUser }>;

const isCookieSecure = process.env.COOKIE_SECURE === "true";

const sessionOptions: SessionOptions = {
  cookieName: sessionCookieName,
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    secure: isCookieSecure,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
  },
};

export async function getSession(): Promise<AppSession> {
  const store = await cookies();
  return getIronSession<{ user?: SessionUser }>(store as any, sessionOptions);
}