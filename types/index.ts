export type Role = "Admin" | "Manager" | "Member";
export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name: string;
}
