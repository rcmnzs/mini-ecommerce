import React, { useEffect, useState } from 'react';
import { Product, CreateProductPayload, UpdateProductPayload } from '../../../types/product';
import * as productService from '../../../services/productService';
import Modal from '../../../components/Modal';
import ConfirmDialog from '../../../components/ConfirmDialog';
import ProductForm from '../../../components/ProductForm';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; product: Product }
  | { type: 'delete'; product: Product };

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchProducts() {
    setLoading(true); setError('');
    try { setProducts(await productService.getProducts()); }
    catch { setError('Erro ao carregar produtos. Verifique se o servidor está rodando.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleCreate(payload: CreateProductPayload | UpdateProductPayload) {
    await productService.createProduct(payload as CreateProductPayload);
    setModal({ type: 'none' }); await fetchProducts();
  }

  async function handleEdit(payload: CreateProductPayload | UpdateProductPayload) {
    if (modal.type !== 'edit') return;
    await productService.updateProduct(modal.product.id, payload as UpdateProductPayload);
    setModal({ type: 'none' }); await fetchProducts();
  }

  async function handleDelete() {
    if (modal.type !== 'delete') return;
    setDeleteLoading(true);
    try { await productService.deleteProduct(modal.product.id); setModal({ type: 'none' }); await fetchProducts(); }
    catch { setError('Erro ao deletar produto.'); }
    finally { setDeleteLoading(false); }
  }

  function formatPrice(price: number) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function getStockBadge(stock: number) {
    if (stock === 0) return { label: 'Sem estoque', color: '#dc2626', bg: '#fef2f2' };
    if (stock <= 5) return { label: `${stock} un.`, color: '#d97706', bg: '#fffbeb' };
    return { label: `${stock} un.`, color: '#16a34a', bg: '#f0fdf4' };
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📦 Produtos</h1>
          <p style={styles.subtitle}>{products.length} produto(s) cadastrado(s)</p>
        </div>
        <button style={styles.addBtn} onClick={() => setModal({ type: 'create' })}>+ Novo Produto</button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}
      {loading && <p style={styles.info}>Carregando...</p>}

      {!loading && products.length === 0 && !error && (
        <div style={styles.emptyState}>
          <p>Nenhum produto cadastrado ainda.</p>
          <button style={styles.addBtn} onClick={() => setModal({ type: 'create' })}>Cadastrar primeiro produto</button>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Categoria</th>
                <th style={styles.th}>Preço</th>
                <th style={styles.th}>Estoque</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Cadastrado em</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const badge = getStockBadge(product.stock);
                return (
                  <tr key={product.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{product.name}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{formatPrice(product.price)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(product.active ? styles.badgeActive : styles.badgeInactive) }}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(product.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button style={styles.editBtn} onClick={() => setModal({ type: 'edit', product })}>Editar</button>
                      <button style={styles.deleteBtn} onClick={() => setModal({ type: 'delete', product })}>Excluir</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal.type === 'create' && (
        <Modal title="Novo Produto" onClose={() => setModal({ type: 'none' })}>
          <ProductForm onSubmit={handleCreate} onCancel={() => setModal({ type: 'none' })} />
        </Modal>
      )}
      {modal.type === 'edit' && (
        <Modal title="Editar Produto" onClose={() => setModal({ type: 'none' })}>
          <ProductForm product={modal.product} onSubmit={handleEdit} onCancel={() => setModal({ type: 'none' })} />
        </Modal>
      )}
      {modal.type === 'delete' && (
        <ConfirmDialog title="Excluir Produto"
          message={`Deseja realmente excluir o produto "${modal.product.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir" onConfirm={handleDelete} onCancel={() => setModal({ type: 'none' })} loading={deleteLoading} />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 },
  subtitle: { color: '#6b7280', marginTop: '0.25rem', fontSize: '0.9rem' },
  addBtn: { padding: '0.6rem 1.25rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  errorBox: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' },
  info: { color: '#6b7280', textAlign: 'center', marginTop: '2rem' },
  emptyState: { textAlign: 'center', padding: '3rem', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  tableWrapper: { overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' },
  thead: { backgroundColor: '#f9fafb' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.85rem 1rem', fontSize: '0.95rem', color: '#374151' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 },
  badgeActive: { backgroundColor: '#f0fdf4', color: '#16a34a' },
  badgeInactive: { backgroundColor: '#fef2f2', color: '#dc2626' },
  editBtn: { padding: '0.35rem 0.85rem', marginRight: '0.5rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', color: '#374151', fontWeight: 500 },
  deleteBtn: { padding: '0.35rem 0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', color: '#dc2626', fontWeight: 500 },
};

export default ProductsPage;
