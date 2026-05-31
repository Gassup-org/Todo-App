export function buildTodoReminderEmail(input: {
  userName: string;
  todoTitle: string;
  dueAt: Date;
  timezone: string;
}) {
  const dueAtText = input.dueAt.toLocaleString('en-US', {
    timeZone: input.timezone,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    subject: `Reminder: ${input.todoTitle}`,
    text: [
      `Hi ${input.userName},`,
      '',
      `This is a reminder for your todo: ${input.todoTitle}`,
      `Due time: ${dueAtText} (${input.timezone})`,
      '',
      'Stay focused.',
      'Todo App',
    ].join('\n'),
  };
}
