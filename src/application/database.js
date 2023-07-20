import { PrismaClient } from "@prisma/client"
import { logger } from "./logging.js"

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
})

prismaClient.$on("error", (e) => {
  logger.error(e)
})

prismaClient.$on("error", (e) => {
  logger.warn(e)
})

prismaClient.$on("error", (e) => {
  logger.info(e)
})

prismaClient.$on("error", (e) => {
  logger.info(e)
})
