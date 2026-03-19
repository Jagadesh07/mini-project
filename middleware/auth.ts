import { AuthUser, Role } from "@/types";
import { getAuthUserFromCookies } from "@/lib/auth";
import { AppError } from "@/utils/errors";

export function requireAuth() {
  return getAuthUserFromCookies();
}

export function requireRole(user: AuthUser, roles: Role[]) {
  if (!roles.includes(user.role)) {
    throw new AppError("Forbidden", 403);
  }
}
