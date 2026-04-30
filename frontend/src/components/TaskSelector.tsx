import { TaskType } from "../api";

interface Props {
  taskType: TaskType;
  onChange: (taskType: TaskType) => void;
}

const TASK_TYPES: Array<{ id: TaskType; label: string; color: string }> = [
  { id: "plan", label: "📅 Day plan", color: "bg-blue-600" },
  { id: "checklist", label: "✅ Checklist", color: "bg-green-600" },
  { id: "template", label: "📝 Template", color: "bg-purple-600" },
  { id: "ideas", label: "💡 Ideas", color: "bg-orange-600" },
  { id: "general", label: "General", color: "bg-zinc-600" },
];

export default function TaskSelector({ taskType, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TASK_TYPES.map((task) => (
        <button
          key={task.id}
          type="button"
          className={`rounded-xl px-3 py-2 text-sm transition ${
            task.id === taskType
              ? task.color
              : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          }`}
          onClick={() => onChange(task.id)}
        >
          {task.label}
        </button>
      ))}
    </div>
  );
}
