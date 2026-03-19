import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { env } from "@/lib/env";

export const accessCookieName = "stm_access";
export const refreshCookieName = "stm_refresh";

const sharedCookie: Partial<ResponseCookie> = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/"
};

if (env.cookieDomain && env.cookieDomain !== "localhost") {
  sharedCookie.domain = env.cookieDomain;
}

export function buildAccessCookie(value: string): ResponseCookie {
  return {
    name: accessCookieName,
    value,
    maxAge: 60 * 15,
    ...sharedCookie
  } as ResponseCookie;
}

export function buildRefreshCookie(value: string): ResponseCookie {
  return {
    name: refreshCookieName,
    value,
    maxAge: 60 * 60 * 24 * 7,
    ...sharedCookie
  } as ResponseCookie;
}

export function clearAuthCookies() {
  return [
    { ...buildAccessCookie(""), maxAge: 0 },
    { ...buildRefreshCookie(""), maxAge: 0 }
  ];
}
