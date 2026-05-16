export type Role = 'ADMIN' | 'USER';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
  active?: boolean;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  active?: boolean;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
