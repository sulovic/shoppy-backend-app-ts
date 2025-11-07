import { userDataSchema, userSensitiveDataSchema, queryParamsSchema, envSchema, jwtPayloadSchema, reklamacijaSchema } from "../schemas/schemas.ts";

declare global {

  type QueryParams = z.infer<typeof queryParamsSchema>;
  type Env = z.infer<typeof envSchema>;
  type UserData = z.infer<typeof userDataSchema>;
  type UserSensitiveData = z.infer<typeof userSensitiveDataSchema>;
  type JWTPayload = z.infer<typeof jwtPayloadSchema>;
  type Reklamacija = z.infer<typeof reklamacijaSchema>;
  namespace NodeJS {
    interface ProcessEnv extends Env { }
  }
}

export { };
