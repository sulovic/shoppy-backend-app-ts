import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_USERS_URL: z.string().url(),
  DATABASE_REKLAMACIJE_URL: z.string().url(),
  DATABASE_OTPAD_URL: z.string().url(),
  DATABASE_ODSUSTVA_URL: z.string().url(),
  DATABASE_NABAVKE_URL: z.string().url(),
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string().min(10),
});

export const userSensitiveDataSchema = z.object({
  userId: z.number().int(),
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.email("Invalid email"),
  passwordHash: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
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
