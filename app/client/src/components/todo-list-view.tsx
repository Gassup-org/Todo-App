import type { Todo } from '../utils/todo-query-hooks';

export function TodoListView({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return <p className="empty-state">No todos for this day yet.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id}>
          <strong>{todo.title}</strong>
          <span>{todo.priority}</span>
        </li>
      ))}
    </ul>
  );
}
