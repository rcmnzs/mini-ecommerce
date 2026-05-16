import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

/**
 * POST /api/v1/users
 * Cadastra um novo usuário.
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/users
 * Lista todos os usuários.
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/users/:id
 * Busca um usuário pelo ID.
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/users/:id
 * Atualiza os dados de um usuário.
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/users/:id
 * Remove um usuário pelo ID.
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
