import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const cookie = event.cookies.get("chat_session");

  if (!cookie && event.url.pathname.startsWith("/c")) {
    return Response.redirect(new URL("/", event.url), 307);
  }

  return resolve(event);
};
