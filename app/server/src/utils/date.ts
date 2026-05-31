export const toUtcDayRange = (date: string) => {
  const d = new Date(`${date}T00:00:00.000Z`);
  const start = d;
  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
};

export const toDateOnly = (value: Date) => value.toISOString().slice(0, 10);
