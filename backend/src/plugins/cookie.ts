import fp from 'fastify-plugin';
import cookiePlugin from '@fastify/cookie';

export const registerCookiePlugin = fp(async (fastify) => {
  await fastify.register(cookiePlugin);
});