import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    sessionId?: string;
    cookies: Record<string, string | undefined>;
  }

  interface FastifyReply {
    setCookie: (
      name: string,
      value: string,
      options?: {
        httpOnly?: boolean;
        sameSite?: 'lax' | 'strict' | 'none';
        secure?: boolean;
        path?: string;
        maxAge?: number;
        domain?: string;
        expires?: Date;
      },
    ) => FastifyReply;
    clearCookie: (
      name: string,
      options?: {
        httpOnly?: boolean;
        sameSite?: 'lax' | 'strict' | 'none';
        secure?: boolean;
        path?: string;
        maxAge?: number;
        domain?: string;
        expires?: Date;
      },
    ) => FastifyReply;
  }
}

export {};
