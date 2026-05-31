import { useEffect, useMemo, useState } from 'react';
import { StateMessage } from '../components/common/StateMessage';
import { TodoForm } from '../components/todo/TodoForm';
import type { TodoFormValue } from '../components/todo/TodoForm';
import { TodoVerticalList } from '../components/todo/TodoVerticalList';
import { TodoPlayingCards } from '../components/todo/TodoPlayingCards';
import { formatDateLabel, toLocalDateInputValue } from '../lib/date';
import { createTodo, deleteTodo, getTodosByDate, toggleTodoCompleted, updateTodo } from '../services/todoApi';
import type { TodoItem } from '../types/todo';

type ViewMode = 'list' | 'cards';

export function CalendarTodosPage() {
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateInputValue(new Date()));
  const [items, setItems] = useState<TodoItem[]>([]);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.status === 'completed' ? 1 : 0) - (b.status === 'completed' ? 1 : 0)),
    [items]
  );

  const loadTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getTodosByDate(selectedDate);
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTodos();
  }, [selectedDate]);

  const handleSubmit = async (value: TodoFormValue) => {
    const payload = {
      title: value.title.trim(),
      description: value.description.trim() || undefined,
      scheduledDate: value.scheduledDate,
      dueTime: value.dueTime || undefined,
      priority: value.priority,
      status: editingTodo?.status ?? 'pending',
      reminderEmailEnabled: value.reminderEmailEnabled,
      reminderAt: value.reminderAt ? new Date(value.reminderAt).toISOString() : undefined
    };

    if (editingTodo) {
      await updateTodo(editingTodo.id, payload);
      setEditingTodo(null);
    } else {
      await createTodo(payload);
    }

    await loadTodos();
  };

  const onToggle = async (todo: TodoItem) => {
    await toggleTodoCompleted(todo.id);
    await loadTodos();
  };

  const onDelete = async (todo: TodoItem) => {
    await deleteTodo(todo.id);
    await loadTodos();
  };

  return (
    <section className="page-stack">
      <div className="page-header-row">
        <div>
          <h2>Calendar Todos</h2>
          <p className="muted">{formatDateLabel(selectedDate)}</p>
        </div>
        <div className="view-switch" role="tablist" aria-label="todo view mode">
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
          >
            Vertical List
          </button>
          <button
            className={viewMode === 'cards' ? 'active' : ''}
            onClick={() => setViewMode('cards')}
            aria-pressed={viewMode === 'cards'}
          >
            Playing Cards
          </button>
        </div>
      </div>

      <div className="grid-layout">
        <div className="panel">
          <label>
            Select Date
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </label>
          <TodoForm
            selectedDate={selectedDate}
            editingTodo={editingTodo}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingTodo(null)}
          />
        </div>

        <div className="panel">
          {loading ? <StateMessage title="Loading todos" description="Syncing tasks for selected date..." /> : null}
          {error ? <StateMessage variant="error" title="Cannot load todos" description={error} /> : null}
          {!loading && !error && sortedItems.length === 0 ? (
            <StateMessage title="No todos for this date" description="Create one using the form." />
          ) : null}
          {!loading && !error && sortedItems.length > 0 && viewMode === 'list' ? (
            <TodoVerticalList items={sortedItems} onDelete={onDelete} onEdit={setEditingTodo} onToggle={onToggle} />
          ) : null}
          {!loading && !error && sortedItems.length > 0 && viewMode === 'cards' ? (
            <TodoPlayingCards items={sortedItems} onDelete={onDelete} onEdit={setEditingTodo} onToggle={onToggle} />
          ) : null}
        </div>
      </div>
    </section>
  );
}