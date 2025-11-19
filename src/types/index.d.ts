import {
  userDataSchema,
  userSensitiveDataSchema,
  queryParamsSchema,
  envSchema,
  jwtPayloadSchema,
  reklamacijaSchema,
  JciPodaciSchema,
  JciProizvodiSchema,
  ProizvodMasaOtpadaSchema,
  ProizvodiSchema,
  VrstaOtpadaSchema,
  JciProizvodiSchema,
  JciPodaciSchema,
} from "../schemas/schemas.ts";

declare global {
  type QueryParams = z.infer<typeof queryParamsSchema>;
  type Env = z.infer<typeof envSchema>;
  type UserData = z.infer<typeof userDataSchema>;
  type UserSensitiveData = z.infer<typeof userSensitiveDataSchema>;
  type JWTPayload = z.infer<typeof jwtPayloadSchema>;
  type Reklamacija = z.infer<typeof reklamacijaSchema>;
  type JciPodaci = z.infer<typeof JciPodaciSchema>;
  type JciProizvodi = z.infer<typeof JciProizvodiSchema>;
  type ProizvodMasaOtpada = z.infer<typeof ProizvodMasaOtpadaSchema>;
  type Proizvodi = z.infer<typeof ProizvodiSchema>;
  type VrstaOtpada = z.infer<typeof VrstaOtpadaSchema>;
  type JciProizvodi = z.infer<typeof JciProizvodiSchema>;
  type JciPodaci = z.infer<typeof JciPodaciSchema>;
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
