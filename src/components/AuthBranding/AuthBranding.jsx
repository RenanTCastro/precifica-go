import { StatCard } from "../StatCard/StatCard";
import logoWhite from "../../assets/logo_white.svg";
import "./AuthBranding.css";

export function AuthBranding({ headline, subtext, stats = [] }) {
  return (
    <aside className="auth-branding">
      <div className="auth-branding__logo">
        <img src={logoWhite} alt="Precifica Go" />
      </div>
      <div className="auth-branding__content">
        <h1 className="auth-branding__headline">{headline}</h1>
        <p className="auth-branding__subtext">{subtext}</p>
        {stats.length > 0 && (
          <div className="auth-branding__stats">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        )}
      </div>
      <div className="auth-branding__decor" aria-hidden />
    </aside>
  );
}
