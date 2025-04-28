// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!((global as typeof global & { prisma: PrismaClient }).prisma)) {
    (global as typeof global & { prisma: PrismaClient }).prisma = new PrismaClient();
  }
  prisma = (global as typeof global & { prisma: PrismaClient }).prisma;
}

export default prisma;