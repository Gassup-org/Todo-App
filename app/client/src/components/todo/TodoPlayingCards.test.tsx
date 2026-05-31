import { fireEvent, render, screen } from '@testing-library/react';
import { TodoPlayingCards } from './TodoPlayingCards';
import type { TodoItem } from '../../types/todo';

const items: TodoItem[] = [{
  id: '1', userId: 'u1', title: 'A', description: 'D', scheduledDate: '2026-05-30', dueTime: '09:00',
  priority: 'high', status: 'pending', reminderEmailEnabled: false, createdAt: '', updatedAt: ''
}];

test('renders card and triggers actions', () => {
  const onToggle = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  render(<TodoPlayingCards items={items} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />);

  fireEvent.click(screen.getByText('Mark Done'));
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.click(screen.getByText('Delete'));

  expect(onToggle).toHaveBeenCalledTimes(1);
  expect(onEdit).toHaveBeenCalledTimes(1);
  expect(onDelete).toHaveBeenCalledTimes(1);
});