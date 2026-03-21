import "./Input.css";

export function Input({ label, icon, id, type = "text", ...props }) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className="input"
          {...props}
        />
      </div>
    </div>
  );
}
