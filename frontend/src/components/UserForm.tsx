import React, { useState, useEffect } from 'react';
import { User, CreateUserPayload, UpdateUserPayload } from '../types/user';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  onCancel: () => void;
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('Nome e e-mail são obrigatórios.');
      return;
    }

    if (!isEditing && password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (isEditing && password && password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const payload = isEditing
        ? { name, email, ...(password ? { password } : {}) }
        : { name, email, password };
      await onSubmit(payload);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? 'Erro ao salvar usuário.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.field}>
        <label style={styles.label}>Nome</label>
        <input
          style={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="João Silva"
          disabled={loading}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>E-mail</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="joao@email.com"
          disabled={loading}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          Senha {isEditing && <span style={styles.optional}>(deixe em branco para manter)</span>}
        </label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEditing ? '••••••••' : 'Mínimo 8 caracteres'}
          disabled={loading}
        />
      </div>

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  field: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '0.4rem',
  },
  optional: {
    fontWeight: 400,
    color: '#9ca3af',
    fontSize: '0.8rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  },
  cancelBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    color: '#374151',
  },
  submitBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
  },
};

export default UserForm;
