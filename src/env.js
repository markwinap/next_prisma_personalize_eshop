import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    COGNITO_CLIENT_ID: z.string(),
    COGNITO_CLIENT_SECRET: z.string(),
    COGNITO_ISSUER: z.string(),

    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),

    AWS_PERSONALIZE_RECOMENDER_MOST_VIEWED_ARN: z.string().min(1),
    AWS_PERSONALIZE_RECOMENDER_FOR_YOU_ARN: z.string().min(1),
    AWS_PERSONALIZE_FILTER_ARN: z.string().min(1),
    AWS_PERSONALIZE_DATASET_USER_ARN: z.string().min(1),
    AWS_PERSONALIZE_DATASET_ITEM_ARN: z.string().min(1),
    AWS_PERSONALIZE_TRACKING_ID: z.string().min(1),

    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    AWS_PERSONALIZE_RECOMENDER_MOST_VIEWED_ARN: process.env.AWS_PERSONALIZE_RECOMENDER_MOST_VIEWED_ARN,
    AWS_PERSONALIZE_RECOMENDER_FOR_YOU_ARN: process.env.AWS_PERSONALIZE_RECOMENDER_FOR_YOU_ARN,
    AWS_PERSONALIZE_FILTER_ARN: process.env.AWS_PERSONALIZE_FILTER_ARN,
    AWS_PERSONALIZE_DATASET_USER_ARN: process.env.AWS_PERSONALIZE_DATASET_USER_ARN,
    AWS_PERSONALIZE_DATASET_ITEM_ARN: process.env.AWS_PERSONALIZE_DATASET_ITEM_ARN,
    AWS_PERSONALIZE_TRACKING_ID: process.env.AWS_PERSONALIZE_TRACKING_ID,

    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
