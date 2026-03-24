export default () => ({
  port: parseInt(process.env.PORT ?? "3001", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "",
  apiKeyPepper: process.env.API_KEY_PEPPER ?? "",
});
