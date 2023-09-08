import { $Enums, Role, User as UserType } from '@prisma/client';

export class User implements UserType {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: $Enums.Role;
  jwt: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(id: number, email: string, role: Role) {
    this.id = id;
    this.email = email;
    this.role = role;
  }
}
