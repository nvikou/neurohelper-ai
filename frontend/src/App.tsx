<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import ChatList from './components/ChatList'
import ChatWindow from './components/ChatWindow'
import ModelSelect from './components/ModelSelect'
import SystemPrompt from './components/SystemPrompt'
import { getChats, createChat, updateChat, deleteChat, type ChatRef, resetSession } from './api'

export default function App() {
  const [chats, setChats] = useState<ChatRef[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string>()
  const [model, setModel] = useState<string>('gpt-4o-mini')
  const [systemPrompt, setSystemPrompt] = useState<string>('')

  async function load() {
    const data = await getChats()
    setChats(data)
    if (data.length && !selectedChatId) setSelectedChatId(data[0].id)
  }
  useEffect(() => { load() }, [])

  async function onCreate() {
    const title = prompt('Название чата', 'Новый чат') || 'Новый чат'
    const c = await createChat(title)
    setChats(prev => [...prev, c])
    setSelectedChatId(c.id)
  }

  async function onRename(id: string, title: string) {
    const c = await updateChat(id, title)
    setChats(prev => prev.map(x => x.id === id ? c : x))
  }

  async function onDelete(id: string) {
    await deleteChat(id)
    setChats(prev => prev.filter(x => x.id !== id))
    if (selectedChatId === id) setSelectedChatId(undefined)
  }

  return (
    <div className="h-screen grid grid-cols-[260px_1fr]">
      <aside className="border-r border-zinc-800 p-3">
        <ChatList
          chats={chats}
          selectedId={selectedChatId}
          onSelect={setSelectedChatId}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
        />
        <div className="mt-4 flex gap-2">
          <button className="text-xs bg-zinc-700 rounded-lg px-3 py-1"
            onClick={() => { resetSession().then(() => { setChats([]); setSelectedChatId(undefined) }) }}>
            Сброс сессии
          </button>
        </div>
      </aside>
      <main className="flex flex-col">
        <header className="border-b border-zinc-800 p-3 flex items-center gap-3">
          <ModelSelect model={model} onChange={setModel} />
          <div className="flex-1" />
        </header>
        <section className="grid grid-rows-[auto_1fr] gap-3 p-3 h-[calc(100vh-57px)]">
          <SystemPrompt value={systemPrompt} onChange={setSystemPrompt} />
          <div className="min-h-0">
            <ChatWindow chatId={selectedChatId} model={model} systemPrompt={systemPrompt} />
          </div>
        </section>
      </main>
    </div>
  )
=======
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
>>>>>>> 2e92c2f (NeuroHelper)
}
