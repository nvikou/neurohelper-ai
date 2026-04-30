interface Props {
  response: string;
  streaming: boolean;
}

export default function ResponseArea({ response, streaming }: Props) {
  const copyResponse = async () => {
    if (!response) {
      return;
    }
    await navigator.clipboard.writeText(response);
  };

  return (
    <section className="mt-4 flex min-h-0 flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-300">Response</h2>
          <button
            type="button"
            onClick={copyResponse}
            disabled={!response}
            className="rounded-lg bg-zinc-800 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap rounded-xl bg-zinc-950 p-3 text-zinc-100">
          {response || "Generated response will appear here..."}
        {streaming ? <span className="ml-1 inline-block animate-pulse">▍</span> : null}
      </div>
    </section>
  );
}
