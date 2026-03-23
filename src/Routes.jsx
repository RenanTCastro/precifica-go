import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Precificacao from "./pages/Precificacao/Precificacao";
import Configuracoes from "./pages/Configuracoes/Configuracoes";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/precificacao",
        element: (
            <ProtectedRoute>
                <Precificacao />
            </ProtectedRoute>
        ),
    },
    {
        path: "/configuracoes",
        element: (
            <ProtectedRoute>
                <Configuracoes />
            </ProtectedRoute>
        ),
    },
    {
        path: "/landing",
        element: <div>Landing</div>,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "*", 
        element: <div>404</div>,
    },
]);

export default router;