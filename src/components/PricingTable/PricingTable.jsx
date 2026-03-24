import { useState } from "react";
import { ExternalLinkIcon, ChevronUpIcon, ChevronDownIcon } from "../icons";
import "./PricingTable.css";

const SORT_COLUMNS = {
  produto: "produto",
  loja: "loja",
  preco: "preco",
  quantidade: "quantidade",
  precoUnitario: "precoUnitario",
  variacao: "variacao",
};

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularVariacao(preco, precoSugerido) {
  if (!precoSugerido || precoSugerido === 0) return 0;
  return ((preco - precoSugerido) / precoSugerido) * 100;
}

function getVariacaoClasse(variacao) {
  if (Math.abs(variacao) < 0.1) return "igual";
  return variacao > 0 ? "acima" : "abaixo";
}

const QUANTIDADES = Array.from({ length: 20 }, (_, i) => i + 1);

export function PricingTable({
  produtos = [],
  precoSugerido = 0,
  quantidades = {},
  desativados = {},
  onQuantidadeChange,
  onDesativarChange,
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const getQuantidade = (id) => quantidades[id] ?? 1;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortValue = (p, column) => {
    const qtd = getQuantidade(p.id);
    const precoUnitario = p.preco / qtd;
    const variacao = calcularVariacao(precoUnitario, precoSugerido);
    switch (column) {
      case SORT_COLUMNS.produto:
        return (p.produto || "").toLowerCase();
      case SORT_COLUMNS.loja:
        return (p.loja || "").toLowerCase();
      case SORT_COLUMNS.preco:
        return p.preco;
      case SORT_COLUMNS.quantidade:
        return qtd;
      case SORT_COLUMNS.precoUnitario:
        return precoUnitario;
      case SORT_COLUMNS.variacao:
        return variacao;
      default:
        return 0;
    }
  };

  const compareValues = (aVal, bVal, isNumeric) => {
    if (isNumeric) {
      return aVal - bVal;
    }
    return String(aVal).localeCompare(String(bVal));
  };

  const isNumericColumn = (col) =>
    [SORT_COLUMNS.preco, SORT_COLUMNS.quantidade, SORT_COLUMNS.precoUnitario, SORT_COLUMNS.variacao].includes(col);

  // Ordenar: ativos primeiro, desativados por último; depois por coluna selecionada
  const produtosOrdenados = [...produtos].sort((a, b) => {
    const aDesativado = desativados[a.id];
    const bDesativado = desativados[b.id];
    if (aDesativado && !bDesativado) return 1;
    if (!aDesativado && bDesativado) return -1;

    if (!sortColumn) return 0;

    const aVal = getSortValue(a, sortColumn);
    const bVal = getSortValue(b, sortColumn);
    const cmp = compareValues(aVal, bVal, isNumericColumn(sortColumn));
    return sortDirection === "asc" ? cmp : -cmp;
  });

  const SortableHeader = ({ column, children }) => {
    const isActive = sortColumn === column;
    return (
      <th
        className="pricing-table__th-sortable"
        onClick={() => handleSort(column)}
        role="columnheader"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSort(column);
          }
        }}
      >
        <span className="pricing-table__th-content">
          {children}
          {isActive ? (
            sortDirection === "asc" ? (
              <ChevronUpIcon />
            ) : (
              <ChevronDownIcon />
            )
          ) : (
            <span className="pricing-table__th-sort-placeholder" />
          )}
        </span>
      </th>
    );
  };

  return (
    <div className="pricing-table__wrapper">
      <table className="pricing-table">
        <thead>
          <tr>
            <th className="pricing-table__th-checkbox">Ativo</th>
            <th>#</th>
            <SortableHeader column={SORT_COLUMNS.produto}>PRODUTO</SortableHeader>
            <SortableHeader column={SORT_COLUMNS.loja}>LOJA</SortableHeader>
            <SortableHeader column={SORT_COLUMNS.preco}>PREÇO</SortableHeader>
            <SortableHeader column={SORT_COLUMNS.quantidade}>Quantidade do anúncio</SortableHeader>
            <SortableHeader column={SORT_COLUMNS.precoUnitario}>PREÇO UNIT.</SortableHeader>
            <SortableHeader column={SORT_COLUMNS.variacao}>Vs. {formatarMoeda(precoSugerido)}</SortableHeader>
            <th>LINK</th>
          </tr>
        </thead>
        <tbody>
          {produtosOrdenados.length === 0 ? (
            <tr>
              <td colSpan={9} className="pricing-table__empty">
                Calcule e busque preços para ver os resultados do mercado.
              </td>
            </tr>
          ) : (
            produtosOrdenados.map((p) => {
              const qtd = getQuantidade(p.id);
              const precoUnitario = p.preco / qtd;
              const variacao = calcularVariacao(precoUnitario, precoSugerido);
              const variacaoClasse = getVariacaoClasse(variacao);
              const isDesativado = desativados[p.id];

              let variacaoTexto = "";
              if (Math.abs(variacao) < 0.1) {
                variacaoTexto = "Igual";
              } else if (variacao > 0) {
                variacaoTexto = `+${variacao.toFixed(1)}%`;
              } else {
                variacaoTexto = `${variacao.toFixed(1)}%`;
              }

              return (
                <tr
                  key={p.id}
                  className={isDesativado ? "pricing-table__row pricing-table__row--desativada" : "pricing-table__row"}
                >
                  <td className="pricing-table__checkbox">
                    <input
                      type="checkbox"
                      checked={!isDesativado}
                      onChange={(e) => onDesativarChange?.(p.id, e.target.checked)}
                      aria-label={isDesativado ? `Ativar ${p.produto}` : `Desativar ${p.produto}`}
                    />
                  </td>
                  <td className="pricing-table__img">
                    {p.imagem ? (
                      <img src={p.imagem} alt="" className="pricing-table__thumb" />
                    ) : (
                      <div className="pricing-table__placeholder">—</div>
                    )}
                  </td>
                  <td className="pricing-table__produto">{p.produto}</td>
                  <td>{p.loja}</td>
                  <td>{formatarMoeda(p.preco)}</td>
                  <td>
                    <select
                      className="pricing-table__select"
                      value={qtd}
                      onChange={(e) => onQuantidadeChange?.(p.id, e.target.value)}
                      disabled={isDesativado}
                    >
                      {QUANTIDADES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatarMoeda(precoUnitario)}</td>
                  <td>
                    <span className={`pricing-table__variacao pricing-table__variacao--${variacaoClasse}`}>
                      {variacaoTexto}
                    </span>
                  </td>
                  <td>
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pricing-table__link"
                      >
                        Abrir <ExternalLinkIcon />
                      </a>
                    ) : (
                      <span className="pricing-table__link-empty">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
