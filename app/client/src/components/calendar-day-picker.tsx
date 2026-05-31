export function CalendarDayPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="field-label">
      Select day
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
