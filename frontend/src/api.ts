<<<<<<< HEAD
export type Role = 'system' | 'user' | 'assistant'
export interface Message { role: Role; content: string }
export interface ChatRef { id: string; title: string }

export async function getChats(): Promise<ChatRef[]> {
  const res = await fetch('/api/v1/chats')
  if (!res.ok) throw new Error('Failed to load chats')
  return res.json()
}
export async function getChatMessages(chatId: string): Promise<Message[]> {
  const res = await fetch(`/api/v1/chats/${chatId}/messages`)
  if (!res.ok) throw new Error('Failed to load messages')
  return res.json()
}
export async function createChat(title: string): Promise<ChatRef> {
  const res = await fetch('/api/v1/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  if (!res.ok) throw new Error('Failed to create chat')
  return res.json()
}
export async function updateChat(chatId: string, title: string): Promise<ChatRef> {
  const res = await fetch(`/api/v1/chats/${chatId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  if (!res.ok) throw new Error('Failed to update chat')
  return res.json()
}
export async function deleteChat(chatId: string): Promise<void> {
  const res = await fetch(`/api/v1/chats/${chatId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete chat')
}
export async function sendMessage(payload: {
  chat_id: string; user_message: string; model: string; system_prompt: string;
}): Promise<{assistant: string}> {
  const res = await fetch('/api/v1/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Chat request failed')
  return res.json()
}
export function createStreamUrl(q: {
  chat_id: string; user_message: string; model: string; system_prompt: string;
}): string {
  const params = new URLSearchParams({
    chat_id: q.chat_id,
    user_message: q.user_message,
    model: q.model,
    system_prompt: q.system_prompt || ''
  })
  return `/api/v1/chat/stream?${params.toString()}`
}
export async function resetSession(): Promise<void> {
  const res = await fetch('/api/v1/reset-session', { method: 'POST' })
  if (!res.ok) throw new Error('Failed to reset session')
=======
export type TaskType = "plan" | "checklist" | "template" | "ideas" | "general";

export interface HistoryItem {
  id: string;
  query: string;
  task_type: TaskType;
  response: string;
  created_at: string;
}

interface StreamHandlers {
  onDelta: (delta: string) => void;
  onDone: (item: HistoryItem | null) => void;
  onError: (error: string) => void;
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const response = await fetch("/api/v1/history");
  if (!response.ok) {
    throw new Error("Failed to load history");
  }
  return response.json();
}

export async function deleteHistoryItem(itemId: string): Promise<void> {
  const response = await fetch(`/api/v1/history/${itemId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete history item");
  }
}

export async function resetHistory(): Promise<void> {
  const response = await fetch("/api/v1/reset-history", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to reset history");
  }
}

export function streamGenerate(
  query: string,
  taskType: TaskType,
  handlers: StreamHandlers,
): () => void {
  const params = new URLSearchParams({ query, task_type: taskType });
  const source = new EventSource(`/api/v1/generate/stream?${params.toString()}`);

  source.onmessage = (event) => {
    if (event.data === "[DONE]") {
      source.close();
      return;
    }
    try {
      const payload = JSON.parse(event.data) as {
        delta?: string;
        done?: boolean;
        item?: HistoryItem;
        error?: string;
      };
      if (payload.error) {
        handlers.onError(payload.error);
        source.close();
        return;
      }
      if (payload.delta) {
        handlers.onDelta(payload.delta);
      }
      if (payload.done) {
        handlers.onDone(payload.item ?? null);
      }
    } catch (error) {
      handlers.onError(
        error instanceof Error ? error.message : "Stream reading error",
      );
      source.close();
    }
  };

  source.onerror = () => {
    handlers.onError("Stream connection interrupted");
    source.close();
  };

  return () => source.close();
>>>>>>> 2e92c2f (NeuroHelper)
}
