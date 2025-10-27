import { PrismaClient } from "@prisma/client";

// Simple Prisma client wrapper. If your repo uses multiple generated clients
// in the `prisma/` subfolders, replace this export with a specific generated
// client import or re-run `prisma generate` within the TS project.

const prisma = new PrismaClient();

export default prisma;
