import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Each member must be a valid user id");

export const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  members: z.array(objectIdSchema).default([])
});
