import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Sidebar } from "../../components";
import { LogOutIcon } from "../../components/icons";
import "./Configuracoes.css";

const DEFAULT_USER = {
  name: "João Silva",
  email: "joao@empresa.com",
  initials: "JS",
};

export default function Configuracoes() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = DEFAULT_USER;

  const handleLogout = () => {
    // TODO: integrar com auth real
    navigate("/login");
  };

  return (
    <div className="configuracoes">
      <Sidebar
        open={menuOpen}
        onToggle={() => setMenuOpen((o) => !o)}
        onClose={() => setMenuOpen(false)}
      />

      <main className="configuracoes__main">
        <header className="configuracoes__header">
          <div>
            <h1 className="configuracoes__title">Configurações</h1>
            <p className="configuracoes__subtitle">Gerencie sua conta e assinatura</p>
          </div>
        </header>

        <section className="configuracoes__card">
          <h2 className="configuracoes__card-title">Minha conta</h2>
          <p className="configuracoes__card-subtitle">Gerencie suas informações pessoais</p>
          <div className="configuracoes__user">
            <div className="configuracoes__avatar">{user.initials}</div>
            <div className="configuracoes__user-info">
              <span className="configuracoes__user-name">{user.name}</span>
              <span className="configuracoes__user-email">{user.email}</span>
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="configuracoes__logout-btn">
            <LogOutIcon />
            Sair da conta
          </Button>
        </section>
      </main>
    </div>
  );
}
