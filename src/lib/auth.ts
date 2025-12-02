import { hash, compare } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function hashPassword(password: string) {
  return await hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function createUser(email: string, name: string, password: string) {
  const hashedPassword = await hashPassword(password)
  
  return await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}
