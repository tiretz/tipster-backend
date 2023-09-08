import { Role } from '@prisma/client';

export type JwtUser = {
  sub: number;
  email: string;
  role: Role;
};
