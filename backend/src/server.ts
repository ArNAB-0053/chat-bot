import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';
import { ERROR_MESSAGES } from './constants/error-messages.js';
import { prisma } from './db/prisma.js';
import { app } from './app.js';

let shuttingDown = false;

async function shutdown(signal: string, exitCode: number): Promise<never> {
  if (shuttingDown) {
    process.exit(exitCode);
  }

  shuttingDown = true;

  console.info(`[Server] Shutting down after ${signal}`);

  try {
    await app.close();
    await prisma.$disconnect();
  } catch (error) {
    console.error('[Server] Failed during shutdown', error);
    exitCode = 1;
  }

  process.exit(exitCode);
}

async function startServer(): Promise<void> {
  process.on('SIGINT', () => {
    void shutdown('SIGINT', 0);
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM', 0);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled promise rejection', reason);
    void shutdown('unhandledRejection', 1);
  });

  process.on('uncaughtException', (error) => {
    console.error('[Server] Uncaught exception', error);
    void shutdown('uncaughtException', 1);
  });

  try {
    await prisma.$connect();
    console.info('[Database] Connected successfully');
  } catch (error) {
    console.error('[Database] Connection failed', error);
    process.exit(1);
  }

  try {
    const address = await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    console.info(`[Server] Listening on ${address}`);
  } catch (error) {
    console.error('[Server] Startup error', error);
    console.error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    process.exit(1);
  }
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  void startServer();
}

export { startServer };
