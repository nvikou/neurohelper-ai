interface Props {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: () => void;
  streaming: boolean;
}

export default function QueryForm({
  query,
  setQuery,
  onSubmit,
  streaming,
}: Props) {
  return (
    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <label className="mb-2 block text-sm text-zinc-300" htmlFor="query">
        What do you need to do?
      </label>
      <textarea
        id="query"
        className="min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-zinc-100 outline-none ring-blue-500 focus:ring-2"
        placeholder="For example: make a plan for tomorrow..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={streaming || !query.trim()}
          onClick={onSubmit}
        >
          {streaming ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
