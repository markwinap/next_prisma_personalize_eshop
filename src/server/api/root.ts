import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { yatchRouter } from "~/server/api/routers/yatch";
import { dinningRouter } from "./routers/dinning";
import { destinationRouter } from "./routers/destination";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  yatch: yatchRouter,
  destination: destinationRouter,
  dinning: dinningRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
