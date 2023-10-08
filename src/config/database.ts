import { PrismaClient } from '../../node_modules/prisma/prisma-client';

export let prisma: PrismaClient;
export function connectDb(): void {
  prisma = new PrismaClient();
}

export async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect();
}
