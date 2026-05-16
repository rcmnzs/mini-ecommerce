import api from './api';
import { User, CreateUserPayload, UpdateUserPayload } from '../types/user';

export async function getUsers(): Promise<User[]> {
  const res = await api.get<User[]>('/users');
  return res.data;
}

export async function getUserById(id: string): Promise<User> {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const res = await api.post<User>('/users', payload);
  return res.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const res = await api.put<User>(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
