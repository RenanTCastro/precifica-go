import { useState, useEffect } from "react";
import { Button, Input, Sidebar } from "../../components";
import { PricingTable } from "../../components/PricingTable/PricingTable";
import { buscarProdutosMercado } from "../../services/api";
import { extrairQuantidadeDoNome } from "../../utils/quantidadeParser";
import "./Precificacao.css";

function calcularPrecoSugerido(custo, margem, custosFixos = 0, custosVariaveis = 0) {
  const margemSegura = Math.min(margem, 99.99);
  const custoTotal = custo * (1 + custosFixos / 100 + custosVariaveis / 100);
  return custoTotal / (1 - margemSegura / 100);
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Precificacao() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("Tênis Nike Air Max 270");
  const [precoCusto, setPrecoCusto] = useState(180);
  const [custosFixos, setCustosFixos] = useState(0);
  const [custosVariaveis, setCustosVariaveis] = useState(0);
  const [margemSelecionada, setMargemSelecionada] = useState(30);
  const [produtosMercado, setProdutosMercado] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [desativados, setDesativados] = useState({});
  const [isBuscandoProdutos, setIsBuscandoProdutos] = useState(false);
  const [erroBusca, setErroBusca] = useState(null);

  // Inicializa quantidades a partir do nome do produto quando produtos mudam
  useEffect(() => {
    if (produtosMercado.length === 0) return;
    const init = {};
    produtosMercado.forEach((p) => {
      init[p.id] = extrairQuantidadeDoNome(p.produto);
    });
    setQuantidades(init);
    setDesativados({});
  }, [produtosMercado]);

  const precoSugerido = calcularPrecoSugerido(precoCusto, margemSelecionada, custosFixos, custosVariaveis);

  const margemAnt = Math.max(0, margemSelecionada - 10);
  const margemDep = Math.min(100, margemSelecionada + 10);
  const precosPorMargem = [
    { margem: margemAnt, preco: calcularPrecoSugerido(precoCusto, margemAnt, custosFixos, custosVariaveis) },
    { margem: margemSelecionada, preco: precoSugerido },
    { margem: margemDep, preco: calcularPrecoSugerido(precoCusto, margemDep, custosFixos, custosVariaveis) },
  ];

  // Produtos ativos: não desativados. Stats usam preço unitário.
  const produtosAtivos = produtosMercado.filter((p) => !desativados[p.id]);
  const precosUnitariosAtivos = produtosAtivos.map((p) => {
    const qtd = quantidades[p.id] ?? 1;
    return p.preco / qtd;
  });
  const menorPreco = precosUnitariosAtivos.length ? Math.min(...precosUnitariosAtivos) : 0;
  const maiorPreco = precosUnitariosAtivos.length ? Math.max(...precosUnitariosAtivos) : 0;
  const precoMedio =
    precosUnitariosAtivos.length > 0
      ? precosUnitariosAtivos.reduce((acc, v) => acc + v, 0) / precosUnitariosAtivos.length
      : 0;

  const handleQuantidadeChange = (id, val) => {
    setQuantidades((prev) => ({ ...prev, [id]: Number(val) }));
  };

  const handleDesativarChange = (id, ativo) => {
    setDesativados((prev) => {
      const next = { ...prev };
      if (ativo) delete next[id];
      else next[id] = true;
      return next;
    });
  };

  const handleCalcular = async () => {
    setErroBusca(null);
    setIsBuscandoProdutos(true);
    try {
      const produtos = await buscarProdutosMercado(nomeProduto);
      setProdutosMercado(produtos);
    } catch (err) {
      setErroBusca(err.message || "Erro ao buscar preços do mercado");
      setProdutosMercado([]);
    } finally {
      setIsBuscandoProdutos(false);
    }
  };

  return (
    <div className="precificacao">
      <Sidebar
        open={menuOpen}
        onToggle={() => setMenuOpen((o) => !o)}
        onClose={() => setMenuOpen(false)}
      />

      <main className="precificacao__main">
        <header className="precificacao__header">
          <div>
            <h1 className="precificacao__title">Precificação</h1>
            <p className="precificacao__subtitle">Calcule e compare com o mercado</p>
          </div>
        </header>

        <div className="precificacao__layout">
          <aside className="precificacao__form">
            <div className="precificacao__card">
              <h3 className="precificacao__card-title">Dados do produto</h3>
              <Input
                label="Nome do produto"
                value={nomeProduto}
                onChange={(e) => setNomeProduto(e.target.value)}
                placeholder="Tênis Nike Air Max 270"
              />
            </div>

            <div className="precificacao__card">
              <h3 className="precificacao__card-title">Estrutura de custos</h3>
              <Input
                label="Preço de custo"
                type="number"
                step="0.01"
                min="0"
                value={precoCusto || ""}
                onChange={(e) => setPrecoCusto(parseFloat(e.target.value) || 0)}
                placeholder="180,00"
              />
              <div className="precificacao__inputs-row">
                <Input
                  label="Custos fixos (%)"
                  type="number"
                  min={0}
                  max={100}
                  value={custosFixos || ""}
                  onChange={(e) => setCustosFixos(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
                <Input
                  label="Custos variáveis (%)"
                  type="number"
                  min={0}
                  max={100}
                  value={custosVariaveis || ""}
                  onChange={(e) => setCustosVariaveis(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="precificacao__card">
              <h3 className="precificacao__card-title">Margem desejada</h3>
              <div className="precificacao__margem-slider">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={margemSelecionada}
                  onChange={(e) => setMargemSelecionada(Number(e.target.value))}
                  className="precificacao__slider"
                />
                <span className="precificacao__margem-valor">{margemSelecionada}%</span>
              </div>
            </div>

            {erroBusca && (
              <p className="precificacao__erro" role="alert">
                {erroBusca}
              </p>
            )}
            <Button
              variant="primary"
              fullWidth
              onClick={handleCalcular}
              disabled={isBuscandoProdutos}
            >
              {isBuscandoProdutos ? "Buscando..." : "Calcular + Buscar Preços"}
            </Button>
          </aside>

          <section className="precificacao__content">
            <div className="precificacao__cards">
              <div className="precificacao__cards-group">
                <h4 className="precificacao__cards-label">Preço sugerido por margem</h4>
                <div className="precificacao__cards-row">
                  {precosPorMargem.map(({ margem, preco }, i) => {
                    const diff = preco - precoCusto;
                    const isAtivo = margem === margemSelecionada;
                    return (
                      <div
                        key={`${margem}-${i}`}
                        className={`precificacao__card-preco ${isAtivo ? "precificacao__card-preco--ativo" : ""}`}
                      >
                        <span className="precificacao__card-margem">Margem {margem}%</span>
                        <span className="precificacao__card-valor">{formatarMoeda(preco)}</span>
                        <span className="precificacao__card-diff">+ {formatarMoeda(diff)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="precificacao__cards-group">
                <h4 className="precificacao__cards-label">Comparação com o mercado</h4>
                <div className="precificacao__cards-row precificacao__cards-row--mercado">
                  <div className="precificacao__card-mercado precificacao__card-mercado--menor">
                    <span className="precificacao__card-mercado-label">MENOR PREÇO</span>
                    <span className="precificacao__card-mercado-valor">
                      {formatarMoeda(menorPreco)}
                    </span>
                  </div>
                  <div className="precificacao__card-mercado precificacao__card-mercado--medio">
                    <span className="precificacao__card-mercado-label">PREÇO MÉDIO</span>
                    <span className="precificacao__card-mercado-valor">
                      {formatarMoeda(precoMedio)}
                    </span>
                  </div>
                  <div className="precificacao__card-mercado precificacao__card-mercado--maior">
                    <span className="precificacao__card-mercado-label">MAIOR PREÇO</span>
                    <span className="precificacao__card-mercado-valor">
                      {formatarMoeda(maiorPreco)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="precificacao__table-section">
              <PricingTable
                produtos={produtosMercado}
                precoSugerido={precoSugerido}
                quantidades={quantidades}
                desativados={desativados}
                onQuantidadeChange={handleQuantidadeChange}
                onDesativarChange={handleDesativarChange}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
