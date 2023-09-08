import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Role } from '@prisma/client';
import { Competition } from 'src/competition/entities/competition.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User | typeof Competition> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      createMongoAbility as unknown as AbilityClass<AppAbility>,
    );

    // Admin
    if (user.role == Role.ADMIN) {
      can(Action.Manage, 'all');
    } else {
      // User
      can(Action.Read, User);
      can(Action.Update, User, { id: user.id });
      can(Action.Delete, User, { id: user.id });

      // Competition
      can(Action.Read, Competition);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
