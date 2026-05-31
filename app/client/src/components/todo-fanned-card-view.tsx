import type { Todo } from '../utils/todo-query-hooks';

export function TodoFannedCardView({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return <p className="empty-state">No cards to fan out yet.</p>;
  }

  return (
    <ul className="fanned-card-list" aria-label="Fanned todo cards">
      {todos.map((todo, index) => {
        const offset = index - (todos.length - 1) / 2;
        return (
          <li
            key={todo.id}
            className="todo-card"
            style={{ '--card-rotation': `${offset * 6}deg`, '--card-offset': `${offset * 1.5}rem` } as React.CSSProperties}
          >
            <span>{todo.priority}</span>
            <strong>{todo.title}</strong>
            <small>{todo.status}</small>
          </li>
        );
      })}
    </ul>
  );
}
