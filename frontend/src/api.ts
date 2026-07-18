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
}
