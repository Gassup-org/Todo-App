import type { TodoItem } from '../../types/todo';
import { cn } from '../../lib/cn';

interface TodoPlayingCardsProps {
  items: TodoItem[];
  onToggle: (item: TodoItem) => void;
  onEdit: (item: TodoItem) => void;
  onDelete: (item: TodoItem) => void;
}

const priorityRank: Record<TodoItem['priority'], string> = {
  low: '2',
  medium: '7',
  high: 'K'
};

const prioritySuit: Record<TodoItem['priority'], string> = {
  low: '♣',
  medium: '♦',
  high: '♠'
};

export function TodoPlayingCards({ items, onToggle, onEdit, onDelete }: TodoPlayingCardsProps) {
  return (
    <div className="playing-card-grid">
      {items.map((item) => (
        <article key={item.id} className={cn('playing-card', item.status === 'completed' && 'completed')}>
          <div className="card-corner top">
            <span>{priorityRank[item.priority]}</span>
            <span>{prioritySuit[item.priority]}</span>
          </div>

          <div className="card-main">
            <h4>{item.title}</h4>
            <p>{item.description || 'No description'}</p>
            <div className="todo-meta">
              <span className={`chip ${item.priority}`}>{item.priority}</span>
              {item.dueTime ? <span className="chip">{item.dueTime}</span> : null}
            </div>
          </div>

          <div className="card-corner bottom">
            <span>{prioritySuit[item.priority]}</span>
            <span>{priorityRank[item.priority]}</span>
          </div>

          <div className="card-actions">
            <button className="text-button" onClick={() => onToggle(item)}>
              {item.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
            </button>
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