import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FilterModal, Sidebar } from "../../components";
import { KpiCard } from "../../components/KpiCard/KpiCard";
import {
  DocumentIcon,
  DollarIcon,
  CheckIcon,
  AlertIcon,
  PlusIcon,
  FilterIcon,
  ChevronRightIcon,
} from "../../components/icons";
import { listarProdutosDashboard } from "../../services/api";
import "./Dashboard.css";

const KPI_TEMPLATE = [
  { key: "totalProdutos", title: "Produtos Calculados", subtext: "Total cadastrados", icon: DocumentIcon, iconColor: "green" },
  { key: "margemMedia", title: "Margem Média", subtext: "Média dos produtos", icon: DollarIcon, iconColor: "blue", format: (v) => `${Number(v).toFixed(1)}%` },
  { key: "countCompetitivo", title: "Competitivos", subtext: "Dentro da faixa", icon: CheckIcon, iconColor: "green" },
  { key: "countAlertas", title: "Alertas de Preço", subtext: "Abaixo + acima do mercado", icon: AlertIcon, iconColor: "yellow" },
];

const STATUS_LABELS = {
  acima: "Acima do mercado",
  competitivo: "Competitivo",
  abaixo: "Abaixo do mercado",
  sem_dados: "Sem dados",
};

function getStatusClass(status) {
  const map = {
    competitivo: "competitivo",
    abaixo: "abaixo-do-mercado",
    acima: "acima-do-mercado",
    sem_dados: "neutral",
  };
  return map[status] || "neutral";
}

function formatarMoeda(valor) {
  return (typeof valor === "number" ? valor : 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: "", produto: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listarProdutosDashboard({
      page,
      limit: 10,
      status: filters.status || undefined,
      produto: filters.produto || undefined,
    })
      .then((data) => {
        setProducts(data.produtos || []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setStats(data.stats || null);
      })
      .catch((err) => setError(err.message || "Erro ao carregar produtos"))
      .finally(() => setLoading(false));
  }, [page, filters.status, filters.produto]);

  const handleFilterApply = (newFilters) => {
    setFilters({ status: newFilters.status || "", produto: (newFilters.produto || "").trim() });
    setPage(1);
    setFilterModalOpen(false);
  };

  const handleVerMais = (product) => {
    navigate(`/precificacao?id=${product.id}`);
  };

  return (
    <div className="dashboard">
      <Sidebar
        open={menuOpen}
        onToggle={() => setMenuOpen((o) => !o)}
        onClose={() => setMenuOpen(false)}
      />

      <main className="dashboard__main">
        <header className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__subtitle">Todos os seus cálculos e comparações</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/precificacao")}>
            <PlusIcon />
            Novo cálculo
          </Button>
        </header>

        <section className="dashboard__cards">
          {KPI_TEMPLATE.map((tpl) => {
            const Icon = tpl.icon;
            const raw = stats ? stats[tpl.key] : null;
            const value = raw != null ? (tpl.format ? tpl.format(raw) : String(raw)) : "-";
            return (
              <KpiCard
                key={tpl.title}
                title={tpl.title}
                value={value}
                subtext={tpl.subtext}
                trend="neutral"
                icon={<Icon />}
                iconColor={tpl.iconColor}
              />
            );
          })}
        </section>

        <section className="dashboard__products">
          <div className="dashboard__products-header">
            <h2 className="dashboard__products-title">Produtos</h2>
            <div className="dashboard__products-actions">
              <Button variant="secondary" onClick={() => setFilterModalOpen(true)}>
                <FilterIcon />
                Filtrar
              </Button>
            </div>
          </div>

          <div className="dashboard__table-wrapper">
            {error && (
              <p className="dashboard__error" role="alert">
                {error}
              </p>
            )}
            {loading ? (
              <div className="dashboard__table-loading">
                <div className="dashboard__spinner" aria-hidden="true" />
                <p>Carregando produtos...</p>
              </div>
            ) : (
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>PRODUTO</th>
                    <th>CUSTO</th>
                    <th>PREÇO SUGERIDO</th>
                    <th>MARGEM</th>
                    <th>VALOR MERCADO</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="dashboard__table-empty">
                        Nenhum produto calculado ainda. Faça seu primeiro cálculo!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="dashboard__table-product">{product.produto}</td>
                        <td>{formatarMoeda(product.custo)}</td>
                        <td>{formatarMoeda(product.precoSugerido)}</td>
                        <td>{product.margem}%</td>
                        <td>{formatarMoeda(product.valorMercado)}</td>
                        <td>
                          <span
                            className={`dashboard__status dashboard__status--${getStatusClass(product.status)}`}
                          >
                            {STATUS_LABELS[product.status] ?? product.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="dashboard__btn-ver-mais"
                            onClick={() => handleVerMais(product)}
                          >
                            Ver mais
                            <ChevronRightIcon />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          {totalPages > 1 && !loading && (
            <div className="dashboard__pagination">
              <button
                type="button"
                className="dashboard__pagination-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <span className="dashboard__pagination-info">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                className="dashboard__pagination-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Próxima
              </button>
            </div>
          )}
        </section>
      </main>

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
        initialStatus={filters.status}
        initialProduto={filters.produto}
      />
    </div>
  );
}
