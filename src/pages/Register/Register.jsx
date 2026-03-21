import { Link } from "react-router-dom";
import { AuthBranding, Button, Input } from "../../components";
import { UserIcon, EnvelopeIcon, LockIcon } from "../../components/icons";
import logoWhite from "../../assets/logo_white.svg";
import "./Styles.css";

export default function Register() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="register">
      <AuthBranding
        headline="Comece grátis. Cresça com dados."
        subtext="Teste por 14 dias sem cartão de crédito. Configure em minutos e já comece a comparar seus preços com o mercado."
        stats={[
          { value: "14 dias", label: "Trial gratuito" },
          { value: "5 min", label: "Para configurar" },
        ]}
      />
      <main className="register__form-area">
        <div className="register__form-wrapper">
          <div className="register__mobile-logo">
            <img src={logoWhite} alt="Precifica Go" />
          </div>
          <header className="register__form-header">
            <h2 className="register__form-title">Criar conta grátis</h2>
            <p className="register__form-subtitle">14 dias grátis · Sem cartão de crédito</p>
          </header>
          <form onSubmit={handleSubmit} className="register__form">
            <Input
              label="Nome completo"
              type="text"
              icon={<UserIcon />}
              placeholder="João Silva"
            />
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
            <Button type="submit" fullWidth>
              Criar conta grátis
            </Button>
          </form>
          <p className="register__login">
            Já tem conta?{" "}
            <Link to="/login" className="register__login-link">
              Entrar
            </Link>
          </p>
          <p className="register__terms">
            Ao criar uma conta você concorda com os{" "}
            <a href="/termos" className="register__terms-link">Termos de Uso</a>
            {" e "}
            <a href="/privacidade" className="register__terms-link">Política de Privacidade</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
