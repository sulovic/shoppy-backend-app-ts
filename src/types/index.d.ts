interface ProcessEnv {
  PORT: string;
  DATABASE_USERS_URL: string;
  DATABASE_REKLAMACIJE_URL: string;
  DATABASE_OTPAD_URL: string;
  DATABASE_ODSUSTVA_URL: string;
  DATABASE_NABAVKE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  GOOGLE_CLIENT_ID: string;
}

declare type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string | null;
  roleId: number;
  role: string;
};

declare type AuthUser = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role_id: 1001 | 3001 | 5001;
  role: string;
  picture: string;
  superAdmin: boolean;
};

declare type QueryParams = {
  sortBy?: string;
  sortOrder?: string;
  limit?: string;
  page?: string;
  search?: string;
  filters: Record<string, string>?;
};

declare type JWTPayload = {
  user: AuthUser;
  iat: number;
  exp: number;
};
