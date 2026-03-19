import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  project: z.string().min(1),
  assignedTo: z.string().min(1),
  status: z.enum(["Todo", "In Progress", "Completed"]).default("Todo"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  deadline: z.string().datetime()
});

export const taskUpdateSchema = taskSchema.partial();
