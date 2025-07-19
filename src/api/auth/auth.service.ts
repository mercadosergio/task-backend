import { notFound, unauthorized } from "@hapi/boom";
import { compare } from "bcryptjs";
import { env } from "../../config/env";
import jwt from 'jsonwebtoken';
import { prisma } from "../../db/prisma.client";


export class AuthService {
  signToken(user: any) {
    const payload = {
      sub: user.id,
      role: user.role
    };
    const accessToken = jwt.sign(payload, env.JWT_SECRET);
    return {
      accessToken
    };
  }


  async validateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) throw notFound('Usuario no encontrado');

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw unauthorized('La contraseña ingresada es incorrecta.');

    return user;
  }

  async getProfile(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw notFound('Usuario no encontrado');
    user.password = '';
    return user;
  }
}