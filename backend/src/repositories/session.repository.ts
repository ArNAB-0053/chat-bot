import { prisma } from '../db/prisma.js';

export interface SessionRecord {
  id: string;
  createdAt: Date;
}

export async function createSession(id: string): Promise<SessionRecord> {
  return prisma.session.create({
    data: {
      id,
    },
    select: {
      id: true,
      createdAt: true,
    },
  });
}

export async function findSession(id: string): Promise<SessionRecord | null> {
  return prisma.session.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      createdAt: true,
    },
  });
}
