import type { ConversationMessage } from "$lib/types/message";

export interface LocalConversationState {
  isInitialized: boolean;
  isStreaming: boolean;
  messages: ConversationMessage[];
}

export class ConversationStore {
  #state = $state<Record<string, LocalConversationState>>({});

  get conversations() {
    return this.#state;
  }

  peekConversation(conversationId: string): LocalConversationState | null {
    return this.#state[conversationId] ?? null;
  }

  getConversation(conversationId: string): LocalConversationState {
    if (!this.#state[conversationId]) {
      this.#state[conversationId] = {
        isInitialized: false,
        isStreaming: false,
        messages: [],
      };
    }
    return this.#state[conversationId];
  }

  initializeConversation(
    conversationId: string,
    initialMessages: ConversationMessage[] = [],
  ) {
    this.#state[conversationId] = {
      isInitialized: true,
      isStreaming: false,
      messages: [...initialMessages],
    };
  }

  addUserMessage(conversationId: string, messageId: string, content: string) {
    const convo = this.getConversation(conversationId);
    convo.messages.push({
      id: messageId,
      role: "user",
      content,
      status: "sending",
    });
  }

  markUserMessageSent(conversationId: string, messageId: string) {
    const msg = this.#state[conversationId]?.messages.find(
      (m) => m.id === messageId,
    );
    if (msg) msg.status = "sent";
  }

  markMessageError(conversationId: string, messageId: string) {
    const msg = this.#state[conversationId]?.messages.find(
      (m) => m.id === messageId,
    );
    if (msg) msg.status = "error";
  }

  addAssistantPlaceholder(conversationId: string, messageId: string) {
    const convo = this.getConversation(conversationId);
    convo.isStreaming = true;
    convo.messages.push({
      id: messageId,
      role: "assistant",
      content: "",
      status: "streaming",
    });
  }

  appendAssistantChunk(
    conversationId: string,
    messageId: string,
    chunk: string,
  ) {
    const msg = this.#state[conversationId]?.messages.find(
      (m) => m.id === messageId,
    );
    if (msg) {
      msg.content += chunk;
      msg.status = "streaming";
    }
  }

  finishAssistantMessage(conversationId: string, messageId: string) {
    const convo = this.#state[conversationId];
    if (convo) {
      convo.isStreaming = false;
      const msg = convo.messages.find((m) => m.id === messageId);
      if (msg) msg.status = "sent";
    }
  }

  clearConversation(conversationId: string) {
    const newState = { ...this.#state };
    delete newState[conversationId];
    this.#state = newState;
  }

  setAssistantError(
    conversationId: string,
    messageId: string,
    errorText: string,
  ) {
    const convo = this.#state[conversationId];
    if (!convo) return;
    convo.isStreaming = false; // stop the spinner
    const msg = convo.messages.find((m) => m.id === messageId);
    if (msg) {
      msg.content = errorText;
      msg.status = "error";
    }
  }
}

export const conversationStore = new ConversationStore();
