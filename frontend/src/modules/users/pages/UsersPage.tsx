import React, { useEffect, useState } from 'react';
import { User, CreateUserPayload, UpdateUserPayload } from '../../../types/user';
import * as userService from '../../../services/userService';
import Modal from '../../../components/Modal';
import ConfirmDialog from '../../../components/ConfirmDialog';
import UserForm from '../../../components/UserForm';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; user: User }
  | { type: 'delete'; user: User };

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch {
      setError('Erro ao carregar usuários. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(payload: CreateUserPayload | UpdateUserPayload) {
    await userService.createUser(payload as CreateUserPayload);
    setModal({ type: 'none' });
    await fetchUsers();
  }

  async function handleEdit(payload: CreateUserPayload | UpdateUserPayload) {
    if (modal.type !== 'edit') return;
    await userService.updateUser(modal.user.id, payload as UpdateUserPayload);
    setModal({ type: 'none' });
    await fetchUsers();
  }

  async function handleDelete() {
    if (modal.type !== 'delete') return;
    setDeleteLoading(true);
    try {
      await userService.deleteUser(modal.user.id);
      setModal({ type: 'none' });
      await fetchUsers();
    } catch {
      setError('Erro ao deletar usuário.');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Usuários</h1>
          <p style={styles.subtitle}>{users.length} usuário(s) cadastrado(s)</p>
        </div>
        <button style={styles.addBtn} onClick={() => setModal({ type: 'create' })}>
          + Novo Usuário
        </button>
      </div>

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Loading */}
      {loading && <p style={styles.info}>Carregando...</p>}

      {/* Empty state */}
      {!loading && users.length === 0 && !error && (
        <div style={styles.emptyState}>
          <p>Nenhum usuário cadastrado ainda.</p>
          <button style={styles.addBtn} onClick={() => setModal({ type: 'create' })}>
            Cadastrar primeiro usuário
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && users.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>E-mail</th>
                <th style={styles.th}>Cadastrado em</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button
                      style={styles.editBtn}
                      onClick={() => setModal({ type: 'edit', user })}
                    >
                      Editar
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => setModal({ type: 'delete', user })}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create */}
      {modal.type === 'create' && (
        <Modal title="Novo Usuário" onClose={() => setModal({ type: 'none' })}>
          <UserForm onSubmit={handleCreate} onCancel={() => setModal({ type: 'none' })} />
        </Modal>
      )}

      {/* Modal: Edit */}
      {modal.type === 'edit' && (
        <Modal title="Editar Usuário" onClose={() => setModal({ type: 'none' })}>
          <UserForm
            user={modal.user}
            onSubmit={handleEdit}
            onCancel={() => setModal({ type: 'none' })}
          />
        </Modal>
      )}

      {/* Modal: Delete */}
      {modal.type === 'delete' && (
        <ConfirmDialog
          title="Excluir Usuário"
          message={`Deseja realmente excluir o usuário "${modal.user.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onCancel={() => setModal({ type: 'none' })}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '0.25rem',
    fontSize: '0.9rem',
  },
  addBtn: {
    padding: '0.6rem 1.25rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  info: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: '2rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  thead: {
    backgroundColor: '#f9fafb',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '0.85rem 1rem',
    fontSize: '0.95rem',
    color: '#374151',
  },
  editBtn: {
    padding: '0.35rem 0.85rem',
    marginRight: '0.5rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#374151',
    fontWeight: 500,
  },
  deleteBtn: {
    padding: '0.35rem 0.85rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#dc2626',
    fontWeight: 500,
  },
};

export default UsersPage;
