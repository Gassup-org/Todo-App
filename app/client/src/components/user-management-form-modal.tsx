export function UserManagementFormModal() {
  return (
    <form className="todo-form" aria-label="Create user form">
      <label className="field-label">
        Email
        <input type="email" placeholder="new-user@example.com" />
      </label>
      <label className="field-label">
        Name
        <input placeholder="New user" />
      </label>
      <button className="login-link" type="button">
        Create user
      </button>
    </form>
  );
}
