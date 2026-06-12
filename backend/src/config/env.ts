import 'dotenv/config';

import dotenv from "dotenv";

dotenv.config();

type NodeEnv = 'development' | 'test' | 'production';

function parsePort(value: string | undefined): number {
  const resolvedValue = value?.trim() || '3001';
  const parsedValue = Number.parseInt(resolvedValue, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error('Invalid PORT value');
  }

  return parsedValue;
}

function parseNodeEnv(value: string | undefined): NodeEnv {
  const resolvedValue = (value?.trim() || 'development') as NodeEnv;

  if (resolvedValue !== 'development' && resolvedValue !== 'test' && resolvedValue !== 'production') {
    throw new Error('Invalid NODE_ENV value');
  }

  return resolvedValue;
}

const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!openRouterApiKey) {
  throw new Error('Missing OPENAI_API_KEY');
}

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL');
}

export const env = Object.freeze({
  PORT: parsePort(process.env.PORT),
  DATABASE_URL: databaseUrl,
  NODE_ENV: parseNodeEnv(process.env.NODE_ENV),
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  OPENROUTER_API_KEY: openRouterApiKey,
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL ?? 'openai/gpt-oss-120b:free'
});

export type Env = typeof env;
