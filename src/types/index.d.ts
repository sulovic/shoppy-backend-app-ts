import { userDataSchema, userSensitiveDataSchema, queryParamsSchema } from "../schemas/schemas.ts";

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

declare global {
  type UserData = z.infer<typeof userDataSchema>;
  type UserSensitiveData = z.infer<typeof userSensitiveDataSchema>;
  type QueryParams = z.infer<typeof queryParamsSchema>;
  type JWTPayload = {
    user: UserData;
    iat: number;
    exp: number;
  };
}
