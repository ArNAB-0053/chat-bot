import { prisma } from '../db/prisma.js';

export interface ConversationRecord {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  sessionId: string;
}

export async function createConversation(sessionId: string, title: string): Promise<ConversationRecord> {
  return prisma.conversation.create({
    data: {
      sessionId,
      title,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      sessionId: true,
    },
  });
}

export async function getConversationsBySession(sessionId: string): Promise<ConversationRecord[]> {
  return prisma.conversation.findMany({
    where: {
      sessionId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      sessionId: true,
    },
  });
}

export async function getConversationById(id: string): Promise<ConversationRecord | null> {
  return prisma.conversation.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      sessionId: true,
    },
  });
}
