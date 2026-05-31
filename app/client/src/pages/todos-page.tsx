import { useState } from 'react';
import { AppShell } from '../components/app-shell';
import { CalendarDayPicker } from '../components/calendar-day-picker';
import { NeonPanel } from '../components/neon-panel';
import { TodoFannedCardView } from '../components/todo-fanned-card-view';
import { TodoFormModal } from '../components/todo-form-modal';
import { TodoListView } from '../components/todo-list-view';
import { type TodoViewMode, ViewModeToggle } from '../components/view-mode-toggle';
import { toDateInputValue } from '../utils/date-timezone-utils';
import { useCreateTodo, useTodos } from '../utils/todo-query-hooks';

export function TodosPage() {
  const [selectedDate, setSelectedDate] = useState(toDateInputValue());
  const [viewMode, setViewMode] = useState<TodoViewMode>('list');
  const todos = useTodos(selectedDate);
  const createTodo = useCreateTodo(selectedDate);

  return (
    <AppShell>
      <NeonPanel className="todo-page-panel">
        <p className="eyebrow">Daily todo list</p>
        <h1>{selectedDate}</h1>
        <div className="todo-toolbar">
          <CalendarDayPicker value={selectedDate} onChange={setSelectedDate} />
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
        </div>
        <TodoFormModal onSubmit={(todo) => createTodo.mutate(todo)} />
        {todos.isLoading ? <p>Loading todos...</p> : null}
        {todos.error ? <p role="alert">Could not load todos.</p> : null}
        {viewMode === 'list' ? (
          <TodoListView todos={todos.data ?? []} />
        ) : (
          <TodoFannedCardView todos={todos.data ?? []} />
        )}
      </NeonPanel>
    </AppShell>
  );
}
