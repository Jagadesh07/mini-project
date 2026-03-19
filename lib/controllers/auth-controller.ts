import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  getRefreshTokenFromCookies,
  hashPassword,
  verifyRefreshToken
} from "@/lib/auth";
import { User } from "@/models/User";
import { buildAccessCookie, buildRefreshCookie, clearAuthCookies } from "@/utils/cookies";
import { AppError } from "@/utils/errors";
import { forgotPasswordSchema, loginSchema, profileSchema, registerSchema } from "@/validations/auth";
import { parseBody } from "@/lib/api/parse-body";
import { NextRequest } from "next/server";
import { AuthUser, Role } from "@/types";

function serializeUser(user: any): AuthUser {
  return {
    id: String(user._id),
    email: user.email,
    role: user.role as Role,
    name: user.name,
    avatarUrl: user.avatarUrl || null,
    jobTitle: user.jobTitle || "",
    bio: user.bio || "",
    phone: user.phone || "",
    location: user.location || ""
  };
}

export async function getCurrentUserProfile(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return serializeUser(user);
}

export async function updateCurrentUserProfile(userId: string, request: NextRequest) {
  await connectToDatabase();
  const payload = await parseBody(request, profileSchema);
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.name = payload.name;
  user.avatarUrl = payload.avatarUrl || null;
  user.jobTitle = payload.jobTitle || "";
  user.bio = payload.bio || "";
  user.phone = payload.phone || "";
  user.location = payload.location || "";

  const safeUser = serializeUser(user);
  const accessToken = createAccessToken(safeUser);
  const refreshToken = createRefreshToken(safeUser);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: safeUser,
    cookies: [buildAccessCookie(accessToken), buildRefreshCookie(refreshToken)]
  };
}

export async function registerUser(request: NextRequest) {
  await connectToDatabase();
  const payload = await parseBody(request, registerSchema);

  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const hashedPassword = await hashPassword(payload.password);
  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
    password: hashedPassword
  });

  const safeUser = serializeUser(user);
  const accessToken = createAccessToken(safeUser);
  const refreshToken = createRefreshToken(safeUser);
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: safeUser,
    cookies: [buildAccessCookie(accessToken), buildRefreshCookie(refreshToken)]
  };
}

export async function loginUser(request: NextRequest) {
  await connectToDatabase();
  const payload = await parseBody(request, loginSchema);
  const user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await comparePassword(payload.password, user.password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const safeUser = serializeUser(user);
  const accessToken = createAccessToken(safeUser);
  const refreshToken = createRefreshToken(safeUser);
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: safeUser,
    cookies: [buildAccessCookie(accessToken), buildRefreshCookie(refreshToken)]
  };
}

export async function logoutUser() {
  await connectToDatabase();
  const token = cookies().get("stm_refresh")?.value;

  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { $set: { refreshToken: null } });
  }

  return {
    cookies: clearAuthCookies()
  };
}

export async function refreshUserToken() {
  await connectToDatabase();
  const refreshToken = getRefreshTokenFromCookies();
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Refresh token is invalid or rotated", 401);
  }

  const safeUser = serializeUser(user);
  const nextRefreshToken = createRefreshToken(safeUser);
  const accessToken = createAccessToken(safeUser);
  user.refreshToken = nextRefreshToken;
  await user.save();

  return {
    user: safeUser,
    cookies: [buildAccessCookie(accessToken), buildRefreshCookie(nextRefreshToken)]
  };
}

export async function forgotPassword(request: NextRequest) {
  await connectToDatabase();
  const payload = await parseBody(request, forgotPasswordSchema);
  const user = await User.findOne({ email: payload.email.toLowerCase() });

  return {
    email: payload.email,
    simulated: true,
    message: user
      ? `Password reset link simulated for ${payload.email}`
      : "If the account exists, a reset email has been simulated"
  };
}
