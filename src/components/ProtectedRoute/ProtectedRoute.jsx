import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken } from "../../services/api";

/**
 * Protege rotas que exigem autenticação.
 * Redireciona para /login se o usuário não estiver logado.
 */
export function ProtectedRoute({ children }) {
  const token = getStoredToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
