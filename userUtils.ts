import { User } from '../types';
import { mockUsers } from '../data/mockData';

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

export const getUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
};