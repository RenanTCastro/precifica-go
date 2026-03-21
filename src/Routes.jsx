import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello World</div>,
    },
    {
        path: "/landing",
        element: <div>Landing</div>,
    },
    {
        path: "/login",
        element: <div>Login</div>,
    },
    {
        path: "/register",
        element: <div>Register</div>,
    },
    {
        path: "*", 
        element: <div>404</div>,
    },
]);

export default router;