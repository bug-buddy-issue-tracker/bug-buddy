import { serverEnv } from "@/env";

export const emailBaseUrl =
  serverEnv.APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://localhost:3000");
