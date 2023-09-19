import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Competition } from 'src/competition/entities/competition.entity';
import { AppAbility } from './types/appability.type';
import { UserRole } from 'src/user/enums/role.enum';
import { Subjects } from './types/subjects.type';
import { Action } from './enums/action.enum';

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      createMongoAbility as unknown as AbilityClass<AppAbility>,
    );

    // Admin
    if (user.role == UserRole.ADMIN) {
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
