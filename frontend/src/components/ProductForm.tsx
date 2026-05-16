import React, { useState, useEffect } from 'react';
import { Product, CreateProductPayload, UpdateProductPayload } from '../types/product';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductPayload | UpdateProductPayload) => Promise<void>;
  onCancel: () => void;
}

function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description ?? '');
      setPrice(String(product.price));
      setStock(String(product.stock));
    }
  }, [product]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name) {
      setError('O nome do produto é obrigatório.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Informe um preço válido (maior ou igual a zero).');
      return;
    }

    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError('O estoque não pode ser negativo.');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateProductPayload | UpdateProductPayload = {
        name,
        description: description || undefined,
        price: parsedPrice,
        stock: parsedStock,
      };
      await onSubmit(payload);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? 'Erro ao salvar produto.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.field}>
        <label style={styles.label}>Nome do produto</label>
        <input
          style={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Tênis Nike Air Max"
          disabled={loading}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          Descrição <span style={styles.optional}>(opcional)</span>
        </label>
        <textarea
          style={{ ...styles.input, resize: 'vertical', minHeight: '80px' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do produto..."
          disabled={loading}
        />
      </div>

      <div style={styles.row}>
        <div style={{ ...styles.field, flex: 1 }}>
          <label style={styles.label}>Preço (R$)</label>
          <input
            style={styles.input}
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div style={{ ...styles.field, flex: 1 }}>
          <label style={styles.label}>Estoque</label>
          <input
            style={styles.input}
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            disabled={loading}
          />
        </div>
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
  row: {
    display: 'flex',
    gap: '1rem',
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

export default ProductForm;
