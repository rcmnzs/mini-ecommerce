// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock?: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
