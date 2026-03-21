import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, XIcon } from "../icons";
import "./Sidebar.css";

const DEFAULT_ITEMS = [
  { path: "/dashboard", label: "Dashboard", badge: 24 },
  { path: "/precificacao", label: "Precificação" },
  { path: "/configuracoes", label: "Configurações" },
];

const DEFAULT_USER = {
  name: "João Silva",
  plan: "Plano Pro",
  avatar: "JS",
};

export function Sidebar({
  open,
  onToggle,
  onClose,
  items = DEFAULT_ITEMS,
  user = DEFAULT_USER,
}) {
  const location = useLocation();

  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose?.();
    const handleResize = () => window.innerWidth >= 768 && onClose?.();
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? <XIcon /> : <MenuIcon />}
      </button>

      <div
        className={`sidebar__overlay ${open ? "sidebar__overlay--visible" : ""}`}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${open ? "sidebar--open" : ""}`}
      >
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">PG</span>
          <span className="sidebar__logo-text">Precifica Go</span>
        </div>

        <nav className="sidebar__nav">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__nav-item ${location.pathname === item.path ? "sidebar__nav-item--active" : ""}`}
              onClick={onClose}
            >
              <span>{item.label}</span>
              {item.badge != null && (
                <span className="sidebar__nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar__user">
          <div className="sidebar__avatar">{user.avatar}</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{user.name}</span>
            <span className="sidebar__user-plan">{user.plan}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
