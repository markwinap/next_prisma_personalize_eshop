import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const postSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  cusineType: z.string().min(1),
  reservationRequired: z.boolean(),
  bar: z.boolean(),
  breakfast: z.boolean(),
  lunch: z.boolean(),
  dinner: z.boolean(),
  yatchId: z.string().min(1),
});


export const destinationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        location,
        cusineType,
        reservationRequired,
        bar,
        breakfast,
        lunch,
        dinner,
        yatchId,
      } = input;
      return ctx.db.dinning.create({
        data: {
          name,
          location,
          cusineType,
          reservationRequired,
          bar,
          breakfast,
          lunch,
          dinner,
          yatchId,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.dinning.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.dinning.findUnique({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(postSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        name,
        location,
        cusineType,
        reservationRequired,
        bar,
        breakfast,
        lunch,
        dinner,
        yatchId,
      } = input;
      return ctx.db.dinning.update({
        where: { id },
        data: {
          name,
          location,
          cusineType,
          reservationRequired,
          bar,
          breakfast,
          lunch,
          dinner,
          yatchId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dinning.delete({
        where: { id: input.id },
      });
    })
});
