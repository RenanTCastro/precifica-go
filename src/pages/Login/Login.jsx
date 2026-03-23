import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthBranding, Button, Input } from "../../components";
import { EnvelopeIcon, LockIcon } from "../../components/icons";
import { login, setAuthData } from "../../services/api";
import logoWhite from "../../assets/logo_white.svg";
import "./Styles.css";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { token } = await login(email, password);
            setAuthData({ token });
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Erro ao fazer login. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
        <AuthBranding
            headline="Precifique com inteligência. Venda com margem."
            subtext="Compare seus preços com o mercado em tempo real e tome decisões estratégicas com dados do Google Shopping."
            stats={[
                { value: "2.4k+", label: "Produtos precificados" },
                { value: "18%", label: "Aumento médio de margem" },
            ]}
        />
        <main className="login__form-area">
            <div className="login__form-wrapper">
                <div className="login__mobile-logo">
                    <img src={logoWhite} alt="Precifica Go" />
                </div>
                <header className="login__form-header">
                    <h2 className="login__form-title">Bem-vindo de volta</h2>
                    <p className="login__form-subtitle">Entre na sua conta para continuar</p>
                </header>
                <form onSubmit={handleSubmit} className="login__form">
                    {error && (
                        <p className="login__error" role="alert">
                            {error}
                        </p>
                    )}
                    <Input
                        label="E-mail"
                        type="email"
                        icon={<EnvelopeIcon />}
                        placeholder="joao@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <Input
                        label="Senha"
                        type="password"
                        icon={<LockIcon />}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <a href="/recuperar-senha" className="login__forgot">
                        Esqueci minha senha
                    </a>
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
                <p className="login__signup">
                    Não tem conta?{" "}
                    <Link to="/register" className="login__signup-link">Criar conta grátis</Link>
                </p>
            </div>
        </main>
        </div>
    );
}
