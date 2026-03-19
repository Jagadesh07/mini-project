import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["Admin", "Manager", "Member"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const profileSchema = z.object({
  name: z.string().min(2),
  avatarUrl: z.string().url().or(z.literal("")).optional(),
  jobTitle: z.string().max(80).optional().default(""),
  bio: z.string().max(240).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  location: z.string().max(80).optional().default("")
});
