import { useNavigate } from "react-router-dom";
import { AuthBranding, Button, Input } from "../../components";
import { EnvelopeIcon, LockIcon } from "../../components/icons";
import logoWhite from "../../assets/logo_white.svg";
import "./Styles.css";

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate("/dashboard");
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
                    <Input
                        label="E-mail"
                        type="email"
                        icon={<EnvelopeIcon />}
                        placeholder="joao@empresa.com"
                    />
                    <Input
                        label="Senha"
                        type="password"
                        icon={<LockIcon />}
                        placeholder="••••••••"
                    />
                    <a href="/recuperar-senha" className="login__forgot">
                        Esqueci minha senha
                    </a>
                    <Button type="submit" fullWidth>
                        Entrar
                    </Button>
                </form>
                <p className="login__signup">
                    Não tem conta?{" "}
                    <a href="/register" className="login__signup-link">Criar conta grátis</a>
                </p>
            </div>
        </main>
        </div>
    );
}
