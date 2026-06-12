import type {
  ApiResponse,
  ConversationPayload,
  ConversationsPayload,
} from "$lib/types/api";
import { env } from "$lib/utils/env";

type CreateConversationRequest = {
  title?: string;
};

type FetchOptions = RequestInit & {
  json?: unknown;
};

async function requestJson<TData>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<TData>> {
  const { json, headers, ...rest } = options;
  const response = await fetch(path, {
    credentials: "include",
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: json === undefined ? rest.body : JSON.stringify(json),
  });

  if (response.status === 401 || response.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return Promise.reject(new Error("Unauthorized"));
  }

  const payload = (await response.json()) as
    | ApiResponse<TData>
    | { message?: string };

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? payload.message
        : "Request failed";
    throw new Error(message || "Request failed");
  }

  return payload as ApiResponse<TData>;
}

export async function getConversations(): Promise<ConversationsPayload> {
  const response = await requestJson<ConversationsPayload>(
    `${env.API_URL}/conversations`,
    {
      method: "GET",
    },
  );

  return response.data;
}

export async function getConversation(
  conversationId: string,
): Promise<ConversationPayload> {
  const response = await requestJson<ConversationPayload>(
    `${env.API_URL}/conversations/${conversationId}`,
    {
      method: "GET",
    },
  );

  return response.data;
}

export async function createConversation(
  body: CreateConversationRequest = {},
): Promise<ConversationPayload> {
  const response = await requestJson<ConversationPayload>(
    `${env.API_URL}/conversations`,
    {
      method: "POST",
      json: body,
    },
  );

  return response.data;
}
