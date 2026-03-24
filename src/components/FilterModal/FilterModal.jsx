import { useState, useEffect } from "react";
import { Modal } from "../Modal/Modal";
import { Button, Input } from "../index";
import "./FilterModal.css";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "competitivo", label: "Competitivo" },
  { value: "abaixo", label: "Abaixo do mercado" },
  { value: "acima", label: "Acima do mercado" },
];

export function FilterModal({ open, onClose, onApply, initialStatus = "", initialProduto = "" }) {
  const [status, setStatus] = useState(initialStatus);
  const [produto, setProduto] = useState(initialProduto);

  useEffect(() => {
    if (open) {
      setStatus(initialStatus);
      setProduto(initialProduto);
    }
  }, [open, initialStatus, initialProduto]);

  const handleApply = () => {
    onApply?.({ status, produto });
    onClose?.();
  };

  const handleClear = () => {
    setStatus("");
    setProduto("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Filtrar produtos">
      <div className="filter-modal">
        <div className="filter-modal__fields">
          <Input
            label="Nome do produto"
            placeholder="Buscar por nome..."
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
          />
          <div className="filter-modal__field">
            <label className="filter-modal__label">Status</label>
            <select
              className="filter-modal__select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-modal__actions">
          <Button variant="secondary" onClick={handleClear}>
            Limpar
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Aplicar filtros
          </Button>
        </div>
      </div>
    </Modal>
  );
}
