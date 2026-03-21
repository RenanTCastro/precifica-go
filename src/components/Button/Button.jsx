import "./Button.css";

export function Button({ children, variant = "primary", fullWidth, type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? "btn--full" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
