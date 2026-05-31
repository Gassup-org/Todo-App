import { useEffect, useMemo, useState } from 'react';
import type { TodoItem, TodoPriority } from '../../types/todo';

export interface TodoFormValue {
  title: string;
  description: string;
  scheduledDate: string;
  dueTime: string;
  priority: TodoPriority;
  reminderEmailEnabled: boolean;
  reminderAt: string;
}

const INITIAL_VALUE: TodoFormValue = {
  title: '',
  description: '',
  scheduledDate: '',
  dueTime: '',
  priority: 'medium',
  reminderEmailEnabled: false,
  reminderAt: ''
};

interface TodoFormProps {
  selectedDate: string;
  editingTodo?: TodoItem | null;
  onSubmit: (value: TodoFormValue) => Promise<void>;
  onCancelEdit: () => void;
}

export function TodoForm({ selectedDate, editingTodo, onSubmit, onCancelEdit }: TodoFormProps) {
  const defaultValue = useMemo<TodoFormValue>(() => {
    if (!editingTodo) {
      return { ...INITIAL_VALUE, scheduledDate: selectedDate };
    }
    return {
      title: editingTodo.title,
      description: editingTodo.description ?? '',
      scheduledDate: editingTodo.scheduledDate,
      dueTime: editingTodo.dueTime ?? '',
      priority: editingTodo.priority,
      reminderEmailEnabled: editingTodo.reminderEmailEnabled,
      reminderAt: editingTodo.reminderAt ? editingTodo.reminderAt.slice(0, 16) : ''
    };
  }, [editingTodo, selectedDate]);

  const [value, setValue] = useState<TodoFormValue>(defaultValue);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(value);
      setValue({ ...INITIAL_VALUE, scheduledDate: selectedDate });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Cannot save todo now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h3>{editingTodo ? 'Edit Todo' : 'Create Todo'}</h3>
      <label>
        Title
        <input
          value={value.title}
          onChange={(event) => setValue((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Ship feature branch"
          maxLength={120}
        />
      </label>

      <label>
        Description
        <textarea
          value={value.description}
          onChange={(event) => setValue((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Optional details"
          rows={3}
          maxLength={400}
        />
      </label>

      <div className="grid-two">
        <label>
          Date
          <input
            type="date"
            value={value.scheduledDate}
            onChange={(event) => setValue((prev) => ({ ...prev, scheduledDate: event.target.value }))}
          />
        </label>

        <label>
          Due Time
          <input
            type="time"
            value={value.dueTime}
            onChange={(event) => setValue((prev) => ({ ...prev, dueTime: event.target.value }))}
          />
        </label>
      </div>

      <label>
        Priority
        <select
          value={value.priority}
          onChange={(event) => setValue((prev) => ({ ...prev, priority: event.target.value as TodoPriority }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={value.reminderEmailEnabled}
          onChange={(event) =>
            setValue((prev) => ({
              ...prev,
              reminderEmailEnabled: event.target.checked,
              reminderAt: event.target.checked ? prev.reminderAt : ''
            }))
          }
        />
        Enable reminder email
      </label>

      {value.reminderEmailEnabled ? (
        <label>
          Reminder At
          <input
            type="datetime-local"
            value={value.reminderAt}
            onChange={(event) => setValue((prev) => ({ ...prev, reminderAt: event.target.value }))}
          />
        </label>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}

      <div className="form-actions">
        {editingTodo ? (
          <button type="button" className="button secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
        <button className="button" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : editingTodo ? 'Update Todo' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}