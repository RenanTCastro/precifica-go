/**
 * Extrai a quantidade do anúncio (kit, peças, unidades) do nome do produto.
 * Usado para preencher semi-automaticamente o select de quantidade.
 *
 * Padrões detectados:
 * - kit 3, kit4, Kit2
 * - Kit C/12, c/12
 * - 3 peças, 3 peça
 * - Kit 3 Unidades, 3 unidades
 *
 * @param {string} produto - Nome do produto
 * @returns {number} Quantidade detectada (1 a 20) ou 1 como fallback
 */
export function extrairQuantidadeDoNome(produto) {
  if (!produto || typeof produto !== "string") return 1;

  const str = produto.trim().toLowerCase();
  if (!str) return 1;

  const MIN = 1;
  const MAX = 20;

  // Kit C/12 ou c/12
  const matchC = str.match(/\bc\s*\/\s*(\d+)/i);
  if (matchC) {
    const n = parseInt(matchC[1], 10);
    if (n >= MIN && n <= MAX) return n;
  }

  // kit 3, kit4, Kit2, kit 03
  const matchKit = str.match(/\bkit\s*(\d+)/i);
  if (matchKit) {
    const n = parseInt(matchKit[1], 10);
    if (n >= MIN && n <= MAX) return n;
  }

  // Kit 3 Unidades, 3 unidades (em contexto de kit)
  const matchUnidades = str.match(/\bkit\s*(\d+)\s*unidades?\b/i) || str.match(/\b(\d+)\s*unidades?\b/i);
  if (matchUnidades) {
    const n = parseInt(matchUnidades[1], 10);
    if (n >= MIN && n <= MAX) return n;
  }

  // 3 peças, 3 peça
  const matchPecas = str.match(/\b(\d+)\s*peças?\b/i);
  if (matchPecas) {
    const n = parseInt(matchPecas[1], 10);
    if (n >= MIN && n <= MAX) return n;
  }

  // Kit 03 (formato alternativo)
  const matchKit03 = str.match(/\bkit\s*0*(\d+)\b/i);
  if (matchKit03) {
    const n = parseInt(matchKit03[1], 10);
    if (n >= MIN && n <= MAX) return n;
  }

  return 1;
}
