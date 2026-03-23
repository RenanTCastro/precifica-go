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

export async function buscarProdutosMercado(nomeProduto) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${API_URL}/produtos-mercado`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: nomeProduto }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao buscar preços do mercado");
  return data;
}
