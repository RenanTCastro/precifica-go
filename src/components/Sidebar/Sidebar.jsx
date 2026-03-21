import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, XIcon, ChartIcon, DollarIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIconMd } from "../icons";
import logo from "../../assets/logo.svg";
import logoWhite from "../../assets/logo_white.svg";
import "./Sidebar.css";

const ITEM_ICONS = {
  dashboard: ChartIcon,
  precificacao: DollarIcon,
  configuracoes: SettingsIcon,
};

const DEFAULT_ITEMS = [
  { path: "/dashboard", label: "Dashboard", badge: 24, iconKey: "dashboard" },
  { path: "/precificacao", label: "Precificação", iconKey: "precificacao" },
  { path: "/configuracoes", label: "Configurações", iconKey: "configuracoes" },
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
  const [expanded, setExpanded] = useState(true);

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
        className={`sidebar ${open ? "sidebar--open" : ""} ${expanded ? "sidebar--expanded" : "sidebar--collapsed"}`}
      >
        <div className="sidebar__logo">
          <img
            src={expanded ? logoWhite : logo}
            alt="Precifica Go"
            className="sidebar__logo-img"
          />
        </div>

        <nav className="sidebar__nav">
          {items.map((item) => {
            const iconKey = (item.iconKey ?? item.path.replace(/^\//, "")) || "dashboard";
            const IconComponent = ITEM_ICONS[iconKey] ?? ChartIcon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar__nav-item ${location.pathname === item.path ? "sidebar__nav-item--active" : ""}`}
                onClick={onClose}
                title={!expanded ? item.label : undefined}
              >
                <span className="sidebar__nav-icon">
                  {IconComponent ? <IconComponent /> : null}
                </span>
                {expanded && <span className="sidebar__nav-label">{item.label}</span>}
                {expanded && item.badge != null && (
                  <span className="sidebar__nav-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user.avatar}</div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-plan">{user.plan}</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar__expand-toggle"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? "Recolher menu" : "Expandir menu"}
          >
            {expanded ? <ChevronLeftIcon /> : <ChevronRightIconMd />}
          </button>
        </div>
      </aside>
    </>
  );
}
