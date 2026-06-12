import { prisma } from '../db/prisma.js';

export interface MessageRecord {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
  conversationId: string;
}

export async function createMessage(
  conversationId: string,
  role: string,
  content: string,
): Promise<MessageRecord> {
  const message = await prisma.$transaction(async (tx) => {
    const [created] = await Promise.all([
      tx.message.create({
        data: { conversationId, role, content },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
          conversationId: true,
        },
      }),
      tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return created;
  });

  return message;
}

export async function getMessages(conversationId: string): Promise<MessageRecord[]> {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
      conversationId: true,
    },
  });
}