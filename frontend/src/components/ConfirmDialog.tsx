import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p style={{ color: '#374151', marginBottom: '1.5rem' }}>{message}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={styles.cancelBtn} disabled={loading}>
          Cancelar
        </button>
        <button onClick={onConfirm} style={styles.confirmBtn} disabled={loading}>
          {loading ? 'Aguarde...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

const styles: Record<string, React.CSSProperties> = {
  cancelBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    color: '#374151',
  },
  confirmBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
  },
};

export default ConfirmDialog;
