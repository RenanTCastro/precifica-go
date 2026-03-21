import { useState } from "react";
import { ExternalLinkIcon } from "../icons";
import "./PricingTable.css";

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

export function PricingTable({ produtos = [], precoSugerido = 0 }) {
  const [quantidades, setQuantidades] = useState({});

  const getQuantidade = (id) => quantidades[id] ?? 1;

  const setQuantidade = (id, val) => {
    setQuantidades((prev) => ({ ...prev, [id]: Number(val) }));
  };

  return (
    <div className="pricing-table__wrapper">
      <table className="pricing-table">
        <thead>
          <tr>
            <th>#</th>
            <th>PRODUTO</th>
            <th>LOJA</th>
            <th>PREÇO</th>
            <th>Quantidade do anúncio</th>
            <th>PREÇO UNIT.</th>
            <th>Vs. {formatarMoeda(precoSugerido)}</th>
            <th>LINK</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length === 0 ? (
            <tr>
              <td colSpan={8} className="pricing-table__empty">
                Calcule e busque preços para ver os resultados do mercado.
              </td>
            </tr>
          ) : (
            produtos.map((p) => {
              const qtd = getQuantidade(p.id);
              const precoUnitario = p.preco / qtd;
              const variacao = calcularVariacao(precoUnitario, precoSugerido);
              const variacaoClasse = getVariacaoClasse(variacao);

              let variacaoTexto = "";
              if (Math.abs(variacao) < 0.1) {
                variacaoTexto = "Igual";
              } else if (variacao > 0) {
                variacaoTexto = `+${variacao.toFixed(1)}%`;
              } else {
                variacaoTexto = `${variacao.toFixed(1)}%`;
              }

              return (
                <tr key={p.id}>
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
                      onChange={(e) => setQuantidade(p.id, e.target.value)}
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
