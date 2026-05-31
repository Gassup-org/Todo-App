import { Role, TodoStatus } from '@prisma/client';
import { prisma } from '../config/db';
import { todoRepository } from '../repositories/todo.repository';
import { userRepository } from '../repositories/user.repository';

export const adminService = {
  async listUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { todos: true } } }
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name ?? user.email,
      role: user.role.toLowerCase(),
      status: user.isActive ? 'active' : 'blocked',
      todoCount: user._count.todos,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    }));
  },

  async getDashboard() {
    const [totalUsers, totalTodos, completedTodos, activeUsers] = await Promise.all([
      prisma.user.count(),
      todoRepository.countAll(),
      prisma.todo.count({ where: { status: TodoStatus.COMPLETED } }),
      prisma.user.count({ where: { isActive: true } })
    ]);

    return {
      totalUsers,
      totalTodos,
      activeUsers,
      completionRate: totalTodos === 0 ? 0 : Number(((completedTodos / totalTodos) * 100).toFixed(2))
    };
  },

  updateRole(userId: string, role: Role) {
    return userRepository.updateRole(userId, role);
  },

  setUserActive(userId: string, isActive: boolean) {
    return userRepository.setActive(userId, isActive);
  }
};
