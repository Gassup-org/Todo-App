import { useState } from 'react';
import { toLocalDateTimeInputValue } from '../utils/date-timezone-utils';
import type { TodoCreate } from '../utils/todo-query-hooks';

export function TodoFormModal({ onSubmit }: { onSubmit: (todo: TodoCreate) => void }) {
  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState(toLocalDateTimeInputValue());
  const [reminderAt, setReminderAt] = useState('');

  return (
    <form
      className="todo-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          title,
          description: null,
          status: 'active',
          priority: 'normal',
          dueAt: new Date(dueAt).toISOString(),
          reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null,
        });
        setTitle('');
        setReminderAt('');
      }}
    >
      <label className="field-label">
        Todo title
        <input value={title} maxLength={160} required onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="field-label">
        Due time
        <input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
      </label>
      <label className="field-label">
        Reminder time
        <input type="datetime-local" value={reminderAt} onChange={(event) => setReminderAt(event.target.value)} />
      </label>
      <button className="login-link" type="submit">
        Add todo
      </button>
    </form>
  );
}
