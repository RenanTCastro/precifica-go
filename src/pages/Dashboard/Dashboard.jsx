import { useState } from "react";
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
import "./Dashboard.css";

// Métricas placeholder - serão calculadas no backend
const KPI_DATA = [
  {
    title: "Produtos Calculados",
    value: "24",
    subtext: "+8 este mês",
    trend: "positive",
    icon: <DocumentIcon />,
    iconColor: "green",
  },
  {
    title: "Margem Média",
    value: "32,4%",
    subtext: "+2,1% vs. mês anterior",
    trend: "positive",
    icon: <DollarIcon />,
    iconColor: "blue",
  },
  {
    title: "Competitivos",
    value: "18",
    subtext: "75% dos produtos",
    trend: "neutral",
    icon: <CheckIcon />,
    iconColor: "green",
  },
  {
    title: "Alertas de Preço",
    value: "3",
    subtext: "Precisam de atenção",
    trend: "warning",
    icon: <AlertIcon />,
    iconColor: "yellow",
  },
];

// Lista de produtos mock - será substituída por dados do backend
const MOCK_PRODUCTS = [
  {
    id: 1,
    produto: "Notebook Dell Inspiron 15",
    custo: "R$ 2.450,00",
    precoSugerido: "R$ 3.290,00",
    margem: "25,5%",
    valorMercado: "R$ 3.180,00",
    status: "Competitivo",
  },
  {
    id: 2,
    produto: "Mouse Gamer Logitech G502",
    custo: "R$ 145,00",
    precoSugerido: "R$ 249,00",
    margem: "41,8%",
    valorMercado: "R$ 279,00",
    status: "Abaixo do mercado",
  },
  {
    id: 3,
    produto: "Teclado Mecânico Keychron K2",
    custo: "R$ 380,00",
    precoSugerido: "R$ 549,00",
    margem: "30,8%",
    valorMercado: "R$ 519,00",
    status: "Acima do mercado",
  },
];

function getStatusClass(status) {
  const map = {
    Competitivo: "competitivo",
    "Abaixo do mercado": "abaixo-do-mercado",
    "Acima do mercado": "acima-do-mercado",
    "Margem baixa": "margem-baixa",
  };
  return map[status] || "neutral";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products] = useState(MOCK_PRODUCTS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const handleFilterApply = (filters) => {
    // Aplicar filtros (integrar com backend depois)
    console.log("Filtros aplicados:", filters);
  };

  const handleVerMais = (product) => {
    // Navegar para detalhes do produto (implementar depois)
    console.log("Ver mais:", product);
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
          {KPI_DATA.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </section>

        <section className="dashboard__products">
          <div className="dashboard__products-header">
            <h2 className="dashboard__products-title">Produtos recentes</h2>
            <div className="dashboard__products-actions">
              <Button variant="secondary" onClick={() => setFilterModalOpen(true)}>
                <FilterIcon />
                Filtrar
              </Button>
            </div>
          </div>

          <div className="dashboard__table-wrapper">
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
                      <td>{product.custo}</td>
                      <td>{product.precoSugerido}</td>
                      <td>{product.margem}</td>
                      <td>{product.valorMercado}</td>
                      <td>
                        <span
                          className={`dashboard__status dashboard__status--${getStatusClass(product.status)}`}
                        >
                          {product.status}
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
          </div>
        </section>
      </main>

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
}
