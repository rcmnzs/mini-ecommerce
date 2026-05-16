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
} from '../dtos/user.dto';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Remove o campo password do objeto User antes de retornar ao cliente.
 */
function toResponseDTO(user: {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}): UserResponseDTO {
  const { password: _password, ...rest } = user;
  return rest;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── User Service ─────────────────────────────────────────────────────────────

/**
 * Cria um novo usuário.
 * @throws ValidationException - se campos obrigatórios faltarem ou email for inválido
 * @throws ValidationException - se senha tiver menos de 8 caracteres
 * @throws ConflictException   - se email já estiver cadastrado
 */
export async function createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
  const { name, email, password } = data;

  // Validações
  if (!name || !email || !password) {
    throw new ValidationException('Campos obrigatórios: name, email, password');
  }

  if (!validateEmail(email)) {
    throw new ValidationException('Formato de e-mail inválido');
  }

  if (password.length < 8) {
    throw new ValidationException('A senha deve ter no mínimo 8 caracteres');
  }

  // Verificar duplicidade de email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictException('E-mail já cadastrado', `O e-mail ${email} já está em uso`);
  }

  const user = await prisma.user.create({
    data: { name, email, password },
  });

  return toResponseDTO(user);
}

/**
 * Lista todos os usuários.
 */
export async function getAllUsers(): Promise<UserResponseDTO[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return users.map(toResponseDTO);
}

/**
 * Busca um usuário pelo ID.
 * @throws NotFoundException - se o usuário não existir
 */
export async function getUserById(id: string): Promise<UserResponseDTO> {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException('Usuário não encontrado', `Nenhum usuário encontrado com o ID: ${id}`);
  }

  return toResponseDTO(user);
}

/**
 * Atualiza os dados de um usuário.
 * @throws NotFoundException   - se o usuário não existir
 * @throws ValidationException - se email for inválido
 * @throws ConflictException   - se o novo email já estiver em uso por outro usuário
 */
export async function updateUser(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
  const { name, email, password } = data;

  // Verificar se usuário existe
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException('Usuário não encontrado', `Nenhum usuário encontrado com o ID: ${id}`);
  }

  // Validar email se fornecido
  if (email && !validateEmail(email)) {
    throw new ValidationException('Formato de e-mail inválido');
  }

  // Validar senha se fornecida
  if (password && password.length < 8) {
    throw new ValidationException('A senha deve ter no mínimo 8 caracteres');
  }

  // Verificar conflito de email (ignorar o próprio usuário)
  if (email && email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      throw new ConflictException('E-mail já cadastrado', `O e-mail ${email} já está em uso`);
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }),
    },
  });

  return toResponseDTO(updated);
}

/**
 * Remove um usuário pelo ID.
 * @throws NotFoundException - se o usuário não existir
 */
export async function deleteUser(id: string): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException('Usuário não encontrado', `Nenhum usuário encontrado com o ID: ${id}`);
  }

  await prisma.user.delete({ where: { id } });
}
