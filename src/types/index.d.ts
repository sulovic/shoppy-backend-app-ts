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

declare type GoogleUser = {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
};

declare type AuthUser = {
  name: string;
  email: string;
  picture: string;
  roleId: number;
  role: string;
};

declare type JWTPayload = {
  user: AuthUser;
  iat: number;
  exp: number;
};
