const oAuthProvidersConfig = {
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectURL: process.env.GOOGLE_CALLBACK_URL!,
    scope: "openid email profile",
  },
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    redirectURL: process.env.GITHUB_CALLBACK_URL!,
    scope: "user:email",
  },
  facebook: {
    authUrl: "https://www.facebook.com/v16.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v16.0/oauth/access_token",
    userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email",
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    redirectURL: process.env.FACEBOOK_CALLBACK_URL!,
    scope: "email,public_profile",
  },
};

export default oAuthProvidersConfig;
