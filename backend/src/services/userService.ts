import prisma from '../config/database';
import {
  ConflictException,
  NotFoundException,
  ValidationException,
} from '../middlewares/errorHandler';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
  Role,
} from '../dtos/user.dto';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toResponseDTO(user: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): UserResponseDTO {
  const { password: _password, ...rest } = user;
  return { ...rest, role: rest.role as Role };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRole(role: string): role is Role {
  return ['ADMIN', 'USER'].includes(role);
}

// ─── User Service ─────────────────────────────────────────────────────────────

export async function createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
  const { name, email, password, role = 'USER', active = true } = data;

  if (!name || !email || !password) {
    throw new ValidationException('Campos obrigatórios: name, email, password');
  }

  if (!validateEmail(email)) {
    throw new ValidationException('Formato de e-mail inválido');
  }

  if (password.length < 8) {
    throw new ValidationException('A senha deve ter no mínimo 8 caracteres');
  }

  if (!validateRole(role)) {
    throw new ValidationException('Perfil inválido. Use: ADMIN ou USER');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictException('E-mail já cadastrado', `O e-mail ${email} já está em uso`);
  }

  const user = await prisma.user.create({
    data: { name, email, password, role, active },
  });

  return toResponseDTO(user);
}

export async function getAllUsers(): Promise<UserResponseDTO[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return users.map(toResponseDTO);
}

export async function getUserById(id: string): Promise<UserResponseDTO> {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException('Usuário não encontrado', `Nenhum usuário encontrado com o ID: ${id}`);
  }

  return toResponseDTO(user);
}

export async function updateUser(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
  const { name, email, password, role, active } = data;

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException('Usuário não encontrado', `Nenhum usuário encontrado com o ID: ${id}`);
  }

  if (email && !validateEmail(email)) {
    throw new ValidationException('Formato de e-mail inválido');
  }

  if (password && password.length < 8) {
    throw new ValidationException('A senha deve ter no mínimo 8 caracteres');
  }

  if (role && !validateRole(role)) {
    throw new ValidationException('Perfil inválido. Use: ADMIN ou USER');
  }

  if (email && email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      throw new ConflictException('E-mail já cadastrado', `O e-mail ${email} já está em uso`);
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(password !== undefined && { password }),
      ...(role !== undefined && { role }),
      ...(active !== undefined && { active }),
    },
  });

  return toResponseDTO(updated);
}

export async function deleteUser(id: string): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException('Usuário não encontrado', `Nenhum usuário encontrado com o ID: ${id}`);
  }
  await prisma.user.delete({ where: { id } });
}
