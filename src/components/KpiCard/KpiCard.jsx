import "./KpiCard.css";

export function KpiCard({ title, value, subtext, trend, icon, iconColor = "green" }) {
  return (
    <div className="kpi-card">
      <div className={`kpi-card__icon kpi-card__icon--${iconColor}`}>{icon}</div>
      <span className="kpi-card__title">{title}</span>
      <span className="kpi-card__value">{value}</span>
      {subtext && (
        <span className={`kpi-card__subtext kpi-card__subtext--${trend || "neutral"}`}>
          {subtext}
        </span>
      )}
    </div>
  );
}
