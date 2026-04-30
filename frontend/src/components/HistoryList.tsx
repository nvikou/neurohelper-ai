import { HistoryItem } from "../api";

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (itemId: string) => void;
}

const TASK_ICONS: Record<string, string> = {
  plan: "📅",
  checklist: "✅",
  template: "📝",
  ideas: "💡",
  general: "💬",
};

export default function HistoryList({ history, onSelect, onDelete }: Props) {
  return (
    <div className="max-h-[calc(100vh-140px)] space-y-2 overflow-y-auto">
      {history.map((item) => (
        <button
          type="button"
          key={item.id}
          className="group w-full rounded-xl bg-zinc-900 p-3 text-left hover:bg-zinc-800"
          onClick={() => onSelect(item)}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs opacity-70">
              {TASK_ICONS[item.task_type] ?? "💬"}
            </span>
            <span
              role="button"
              tabIndex={0}
              className="text-xs text-red-400 opacity-0 transition group-hover:opacity-100"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(item.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onDelete(item.id);
                }
              }}
            >
              ×
            </span>
          </div>
          <div className="truncate text-sm text-zinc-100">{item.query}</div>
          <div className="line-clamp-2 text-xs text-zinc-400">{item.response}</div>
        </button>
      ))}
      {history.length === 0 ? (
        <p className="text-sm text-zinc-500">History is empty for now.</p>
      ) : null}
    </div>
  );
}
