import type { TodoItem } from '../../types/todo';
import { cn } from '../../lib/cn';

interface TodoVerticalListProps {
  items: TodoItem[];
  onToggle: (item: TodoItem) => void;
  onEdit: (item: TodoItem) => void;
  onDelete: (item: TodoItem) => void;
}

export function TodoVerticalList({ items, onToggle, onEdit, onDelete }: TodoVerticalListProps) {
  return (
    <div className="todo-vertical-list">
      {items.map((item) => (
        <article key={item.id} className={cn('todo-row', item.status === 'completed' && 'done')}>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={item.status === 'completed'}
              onChange={() => onToggle(item)}
              aria-label={`toggle ${item.title}`}
            />
            <span>{item.title}</span>
          </label>
          <p className="muted">{item.description || 'No description'}</p>
          <div className="todo-meta">
            <span className={`chip ${item.priority}`}>{item.priority}</span>
            {item.dueTime ? <span className="chip">{item.dueTime}</span> : null}
            <button className="text-button" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button className="text-button danger" onClick={() => onDelete(item)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}