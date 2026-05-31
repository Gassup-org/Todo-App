import { Role } from '@prisma/client';
import { prisma } from '../config/db';

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  upsertGoogleUser(data: { email: string; name?: string; picture?: string; googleId: string }) {
    return prisma.user.upsert({
      where: { email: data.email },
      create: {
        email: data.email,
        name: data.name,
        picture: data.picture,
        googleId: data.googleId,
        role: Role.USER,
        isActive: true,
        lastActiveAt: new Date()
      },
      update: {
        name: data.name,
        picture: data.picture,
        googleId: data.googleId,
        lastActiveAt: new Date()
      }
    });
  },

  listUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastActiveAt: true
      }
    });
  },

  updateRole(userId: string, role: Role) {
    return prisma.user.update({ where: { id: userId }, data: { role } });
  },

  setActive(userId: string, isActive: boolean) {
    return prisma.user.update({ where: { id: userId }, data: { isActive } });
  }
};
