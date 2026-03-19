import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { accessCookieName, refreshCookieName } from "@/utils/cookies";
import { AppError } from "@/utils/errors";
import { AuthUser } from "@/types";

interface TokenPayload extends AuthUser {
  tokenVersion?: number;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function signToken(payload: TokenPayload, secret: string, expiresIn: string) {
  return jwt.sign(payload, secret, {
    expiresIn
  } as SignOptions);
}

export function createAccessToken(payload: TokenPayload) {
  return signToken(payload, env.accessSecret, env.accessExpiry);
}

export function createRefreshToken(payload: TokenPayload) {
  return signToken(payload, env.refreshSecret, env.refreshExpiry);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.refreshSecret) as TokenPayload;
}

export function getAuthUserFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get(accessCookieName)?.value;

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    return verifyAccessToken(token);
  } catch {
    throw new AppError("Invalid access token", 401);
  }
}

export function getRefreshTokenFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get(refreshCookieName)?.value;

  if (!token) {
    throw new AppError("Missing refresh token", 401);
  }

  return token;
}
