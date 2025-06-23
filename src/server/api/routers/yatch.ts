import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


const yatchSchema = z.object({
  name: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear()),
  capacity: z.number().min(1),
});


export const yatchRouter = createTRPCRouter({
  create: protectedProcedure
    .input(yatchSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        year,
        capacity,
      } = input;
      return ctx.db.yatch.create({
        data: {
          name,
          year,
          capacity,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.yatch.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.yatch.findUnique({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(yatchSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, name, year, capacity } = input;
      return ctx.db.yatch.update({
        where: { id },
        data: {
          name,
          year,
          capacity,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.yatch.delete({
        where: { id: input.id },
      });
    })
});
