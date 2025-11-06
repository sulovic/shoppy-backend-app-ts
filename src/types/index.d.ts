import { userDataSchema, userSensitiveDataSchema, queryParamsSchema, envSchema, jwtPayloadSchema } from "../schemas/schemas.ts";

declare global {
  type UserData = z.infer<typeof userDataSchema>;
  type UserSensitiveData = z.infer<typeof userSensitiveDataSchema>;
  type QueryParams = z.infer<typeof queryParamsSchema>;
  type Env = z.infer<typeof envSchema>;
  type JWTPayload = z.infer<typeof jwtPayloadSchema>;
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
