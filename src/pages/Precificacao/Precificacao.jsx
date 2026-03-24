import { useState, useEffect } from "react";
import { unstable_usePrompt } from "react-router-dom";
import { Button, Input, Sidebar } from "../../components";
import { PricingTable } from "../../components/PricingTable/PricingTable";
import { buscarProdutosMercado, salvarProduto, atualizarProduto } from "../../services/api";
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

const INITIAL_VALUES = {
  nomeProduto: "",
  precoCusto: 0,
  custosFixos: 0,
  custosVariaveis: 0,
  margemSelecionada: 0,
};

export default function Precificacao() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [nomeProduto, setNomeProduto] = useState(INITIAL_VALUES.nomeProduto);
  const [precoCusto, setPrecoCusto] = useState(INITIAL_VALUES.precoCusto);
  const [custosFixos, setCustosFixos] = useState(INITIAL_VALUES.custosFixos);
  const [custosVariaveis, setCustosVariaveis] = useState(INITIAL_VALUES.custosVariaveis);
  const [margemSelecionada, setMargemSelecionada] = useState(INITIAL_VALUES.margemSelecionada);
  const [savedValues, setSavedValues] = useState(INITIAL_VALUES);
  const [produtosMercado, setProdutosMercado] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [desativados, setDesativados] = useState({});
  const [isBuscandoProdutos, setIsBuscandoProdutos] = useState(false);
  const [erroBusca, setErroBusca] = useState(null);
  const [ultimoNomeBuscado, setUltimoNomeBuscado] = useState(INITIAL_VALUES.nomeProduto);
  const [produtoId, setProdutoId] = useState(null);
  const [relacionadosDirty, setRelacionadosDirty] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);

  const podeBuscar = nomeProduto.trim() !== "" && nomeProduto !== ultimoNomeBuscado;

  const currentValues = {
    nomeProduto,
    precoCusto,
    custosFixos,
    custosVariaveis,
    margemSelecionada,
  };
  const formDirty =
    currentValues.nomeProduto !== savedValues.nomeProduto ||
    currentValues.precoCusto !== savedValues.precoCusto ||
    currentValues.custosFixos !== savedValues.custosFixos ||
    currentValues.custosVariaveis !== savedValues.custosVariaveis ||
    currentValues.margemSelecionada !== savedValues.margemSelecionada;
  const isDirty = formDirty || relacionadosDirty;

  unstable_usePrompt({
    when: isDirty,
    message: "Você tem informações não salvas. Deseja sair mesmo assim?",
  });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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
    setRelacionadosDirty(true);
  };

  const handleDesativarChange = (id, ativo) => {
    setDesativados((prev) => {
      const next = { ...prev };
      if (ativo) delete next[id];
      else next[id] = true;
      return next;
    });
    setRelacionadosDirty(true);
  };

  const handleSalvarProduto = async () => {
    if (!nomeProduto.trim()) return;
    setErroSalvar(null);
    setSalvando(true);
    const relacionados = produtosMercado.map((p) => ({
      nome: p.produto,
      loja: p.loja || "",
      preco: p.preco,
      link: p.link || "",
      imagem: p.imagem && !String(p.imagem).startsWith("data:") ? p.imagem : null,
      quantidade: quantidades[p.id] ?? 1,
      ativo: !desativados[p.id],
    }));
    const payload = {
      nome: nomeProduto.trim(),
      precoCusto: Number(precoCusto) || 0,
      custosFixos: Number(custosFixos) || 0,
      custosVariaveis: Number(custosVariaveis) || 0,
      margemDesejada: Number(margemSelecionada) || 0,
      relacionados,
    };
    try {
      if (produtoId) {
        await atualizarProduto(produtoId, payload);
      } else {
        const res = await salvarProduto(payload);
        setProdutoId(res.id);
      }
      setSavedValues(currentValues);
      setRelacionadosDirty(false);
    } catch (err) {
      setErroSalvar(err.message || "Erro ao salvar produto");
    } finally {
      setSalvando(false);
    }
  };

  const handleBuscarProdutos = async () => {
    setErroBusca(null);
    setIsBuscandoProdutos(true);
    try {
      const produtos = await buscarProdutosMercado(nomeProduto);
      setProdutosMercado(produtos);
      setUltimoNomeBuscado(nomeProduto);
      setRelacionadosDirty(true);
    } catch (err) {
      setErroBusca(err.message || "Erro ao buscar preços do mercado");
      setProdutosMercado([]);
    } finally {
      setIsBuscandoProdutos(false);
    }
  };

  const handleNovoProduto = () => {
    setNomeProduto(INITIAL_VALUES.nomeProduto);
    setPrecoCusto(INITIAL_VALUES.precoCusto);
    setCustosFixos(INITIAL_VALUES.custosFixos);
    setCustosVariaveis(INITIAL_VALUES.custosVariaveis);
    setMargemSelecionada(INITIAL_VALUES.margemSelecionada);
    setSavedValues(INITIAL_VALUES);
    setProdutosMercado([]);
    setQuantidades({});
    setDesativados({});
    setProdutoId(null);
    setRelacionadosDirty(false);
    setUltimoNomeBuscado(INITIAL_VALUES.nomeProduto);
    setErroBusca(null);
    setErroSalvar(null);
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
          <Button variant="secondary" onClick={handleNovoProduto}>
            Criar novo produto
          </Button>
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

            {erroSalvar && (
              <p className="precificacao__erro" role="alert">
                {erroSalvar}
              </p>
            )}
            <Button
              variant="primary"
              fullWidth
              onClick={handleSalvarProduto}
              disabled={!nomeProduto.trim() || !isDirty || salvando}
            >
              {salvando ? "Salvando..." : produtoId ? "Atualizar produto" : "Criar produto"}
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
              {isBuscandoProdutos ? (
                <div className="precificacao__table-loading">
                  <div className="precificacao__spinner" aria-hidden="true" />
                  <p>Buscando preços do mercado...</p>
                </div>
              ) : (
                <PricingTable
                  produtos={produtosMercado}
                  precoSugerido={precoSugerido}
                  quantidades={quantidades}
                  desativados={desativados}
                  onQuantidadeChange={handleQuantidadeChange}
                  onDesativarChange={handleDesativarChange}
                />
              )}
              {erroBusca && (
                <p className="precificacao__erro precificacao__erro--inline" role="alert">
                  {erroBusca}
                </p>
              )}
              <div className="precificacao__table-footer">
                <Button
                  variant="primary"
                  onClick={handleBuscarProdutos}
                  disabled={!podeBuscar || isBuscandoProdutos}
                >
                  Buscar produtos
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
