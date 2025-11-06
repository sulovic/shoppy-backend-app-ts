import { userDataSchema, userSensitiveDataSchema, queryParamsSchema, envSchema } from "../schemas/schemas.ts";

declare global {
  type UserData = z.infer<typeof userDataSchema>;
  type UserSensitiveData = z.infer<typeof userSensitiveDataSchema>;
  type QueryParams = z.infer<typeof queryParamsSchema>;
  type Env = z.infer<typeof envSchema>;
  type JWTPayload = UserData & { iat: number; exp: number };
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
