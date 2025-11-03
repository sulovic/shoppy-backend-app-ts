import { z } from "zod";

export const userSensitiveDataSchema = z.object({
  userId: z.number().int(),
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.email("Invalid email"),
  passwordHash: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  createdAt: z.date(),
  roleId: z.number().int(),
});

export const queryParamsSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
  search: z.string().optional(),
  filters: z.record(z.string(), z.string()).optional(),
});

export const userDataSchema = z.object({
  userId: z.number().int(),
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.email("Invalid email"),
  roleId: z.number().int(),
  roleName: z.string(),
});
