export type TodoViewMode = 'list' | 'cards';

export function ViewModeToggle({ value, onChange }: { value: TodoViewMode; onChange: (value: TodoViewMode) => void }) {
  return (
    <div className="view-toggle" role="group" aria-label="Todo view mode">
      <button type="button" aria-pressed={value === 'list'} onClick={() => onChange('list')}>
        List
      </button>
      <button type="button" aria-pressed={value === 'cards'} onClick={() => onChange('cards')}>
        Cards
      </button>
    </div>
  );
}
