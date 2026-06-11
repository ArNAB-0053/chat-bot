import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '../config/env.js';

export const registerCorsPlugin = fp(async (fastify) => {
  await fastify.register(cors, {
    origin: env.NODE_ENV === 'production'
      ? env.ALLOWED_ORIGIN        
      : 'http://localhost:5173',  
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
});