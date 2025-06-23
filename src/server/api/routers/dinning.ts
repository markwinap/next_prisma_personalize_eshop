import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const postSchema = z.object({
  name: z.string().min(1),
  voyageType: z.string().min(1),
  voyageRegion: z.string().min(1),
  voyageStartDate: z.date(),
  voyageEndDate: z.date(),
  voyageEmbarkPort: z.string().min(1),
  voyageDisembarkPort: z.string().min(1),
  embarkationCountry: z.string().min(1),
  disEmbarkationCountry: z.string().min(1),
  nights: z.number().int().min(1),
  startingPrice: z.number().min(0),
  ports: z.array(z.string().min(1)),
  yatchId: z.string().min(1),
});


export const dinningRouter = createTRPCRouter({
  create: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        voyageType,
        voyageRegion,
        voyageStartDate,
        voyageEndDate,
        voyageEmbarkPort,
        voyageDisembarkPort,
        embarkationCountry,
        disEmbarkationCountry,
        nights,
        startingPrice,
        ports,
        yatchId,
      } = input;
      return ctx.db.destination.create({
        data: {
          name,
          voyageType,
          voyageRegion,
          voyageStartDate,
          voyageEndDate,
          voyageEmbarkPort,
          voyageDisembarkPort,
          embarkationCountry,
          disEmbarkationCountry,
          nights,
          startingPrice,
          ports,
          yatchId,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.destination.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.destination.findUnique({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(postSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        name,
        voyageType,
        voyageRegion,
        voyageStartDate,
        voyageEndDate,
        voyageEmbarkPort,
        voyageDisembarkPort,
        embarkationCountry,
        disEmbarkationCountry,
        nights,
        startingPrice,
        ports,
        yatchId,
      } = input;
      return ctx.db.destination.update({
        where: { id },
        data: {
          name,
          voyageType,
          voyageRegion,
          voyageStartDate,
          voyageEndDate,
          voyageEmbarkPort,
          voyageDisembarkPort,
          embarkationCountry,
          disEmbarkationCountry,
          nights,
          startingPrice,
          ports,
          yatchId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.destination.delete({
        where: { id: input.id },
      });
    })
});
