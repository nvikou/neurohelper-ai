import { useEffect, useState } from "react";

import {
  deleteHistoryItem,
  fetchHistory,
  HistoryItem,
  resetHistory,
  streamGenerate,
  TaskType,
} from "./api";
import HistoryList from "./components/HistoryList";
import QueryForm from "./components/QueryForm";
import ResponseArea from "./components/ResponseArea";
import TaskSelector from "./components/TaskSelector";

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("general");
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    void loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const items = await fetchHistory();
      setHistory(items);
    } catch (error) {
      console.error(error);
    }
  }

  function handleGenerate() {
    const cleanQuery = query.trim();
    if (!cleanQuery || streaming) {
      return;
    }

    setStreaming(true);
    setResponse("");

    const close = streamGenerate(cleanQuery, taskType, {
      onDelta: (delta) => setResponse((prev) => prev + delta),
      onDone: (item) => {
        if (item) {
          setHistory((prev) => [item, ...prev]);
        }
        setStreaming(false);
      },
      onError: (errorMessage) => {
        setResponse((prev) =>
          `${prev}\n\nОшибка: ${errorMessage}`.trim(),
        );
        setStreaming(false);
      },
    });

    return () => close();
  }

  function loadHistoryItem(item: HistoryItem) {
    setQuery(item.query);
    setTaskType(item.task_type);
    setResponse(item.response);
  }

  async function handleDelete(itemId: string) {
    try {
      await deleteHistoryItem(itemId);
      setHistory((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReset() {
    try {
      await resetHistory();
      setHistory([]);
      setResponse("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="grid h-screen grid-cols-[1fr_300px] bg-zinc-950 text-zinc-100">
      <main className="flex min-h-0 flex-col p-6">
        <TaskSelector taskType={taskType} onChange={setTaskType} />
        <QueryForm
          query={query}
          setQuery={setQuery}
          onSubmit={handleGenerate}
          streaming={streaming}
        />
        <ResponseArea response={response} streaming={streaming} />
      </main>
      <aside className="min-h-0 border-l border-zinc-800 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">History</h2>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg bg-zinc-800 px-2 py-1 text-xs hover:bg-zinc-700"
          >
            Clear
          </button>
        </div>
        <HistoryList
          history={history}
          onSelect={loadHistoryItem}
          onDelete={handleDelete}
        />
      </aside>
    </div>
  );
}
