import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Precificacao from "./pages/Precificacao/Precificacao";
import Configuracoes from "./pages/Configuracoes/Configuracoes";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/precificacao",
        element: <Precificacao />,
    },
    {
        path: "/configuracoes",
        element: <Configuracoes />,
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