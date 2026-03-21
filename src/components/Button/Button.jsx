import "./Button.css";

export function Button({ children, variant = "primary", fullWidth, type = "button", className, ...props }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? "btn--full" : ""} ${className || ""}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
