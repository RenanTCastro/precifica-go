const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const TOKEN_KEY = "precifica_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthData({ token }) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("precifica_user"); // cleanup legado
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");
  return data;
}

function getAuthHeaders() {
  const token = getStoredToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function buscarProdutosMercado(nomeProduto) {
  const res = await fetch(`${API_URL}/produtos-mercado`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ query: nomeProduto }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao buscar preços do mercado");
  return data;
}

export async function listarProdutos() {
  const res = await fetch(`${API_URL}/produtos`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao listar produtos");
  return data;
}

export async function listarProdutosDashboard({ page = 1, limit = 10, status, produto } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);
  if (produto) params.set("produto", produto);
  const res = await fetch(`${API_URL}/produtos?${params}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao listar produtos");
  return data;
}

export async function buscarProduto(id) {
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao buscar produto");
  return data;
}

export async function salvarProduto(payload) {
  const res = await fetch(`${API_URL}/produtos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao salvar produto");
  return data;
}

export async function atualizarProduto(id, payload) {
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao atualizar produto");
  return data;
}

export async function excluirProduto(id) {
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (res.status === 204) return;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao excluir produto");
}
