// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  category: string;
  active?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  active?: boolean;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
