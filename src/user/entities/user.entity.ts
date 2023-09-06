import { Role } from '@prisma/client';

export class User {
  sub: number;
  email: string;
  role: Role;

  constructor(sub: number, email: string, role: Role) {
    this.sub = sub;
    this.email = email;
    this.role = role;
  }
}
