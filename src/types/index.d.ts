import { userDataSchema, userSensitiveDataSchema, queryParamsSchema, envSchema } from "../schemas/schemas.ts";

declare global {
  type UserData = z.infer<typeof userDataSchema>;
  type UserSensitiveData = z.infer<typeof userSensitiveDataSchema>;
  type QueryParams = z.infer<typeof queryParamsSchema>;
  type ENV = z.infer<typeof envSchema>;
  type JWTPayload = {
    user: UserData;
    iat: number;
    exp: number;
  };
}
