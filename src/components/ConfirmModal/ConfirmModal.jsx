import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import "./ConfirmModal.css";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "primary",
  loading = false,
}) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="confirm-modal">
        {message && <p className="confirm-modal__message">{message}</p>}
        <div className="confirm-modal__actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Aguarde..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
