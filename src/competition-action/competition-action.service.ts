import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtUser } from 'src/auth/types/jwtUser';
import { CompetitionService } from 'src/competition/competition.service';
import { UserDto } from 'src/competition/dto/user.dto';
import { Competition } from 'src/competition/entities/competition.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompetitionActionService {
  constructor(
    private competitionService: CompetitionService,
    private userService: UserService,
  ) {}

  async join(id: number, jwtUser: JwtUser): Promise<Competition> {
    const competition = await this.competitionService.findOne(id);

    if (!competition.isActive) throw new BadRequestException('Competition no longer active');

    if (!competition.isOpen) throw new BadRequestException('Cannot join closed competition');

    const alreadyJoined = competition.users.find((value: User, index: number, obj: User[]) => {
      return (value.id = jwtUser.sub);
    });

    if (alreadyJoined) throw new BadRequestException('Already joined competition');

    const user = await this.userService.findOne(jwtUser.sub);

    competition.users.push(user);

    return competition.save();
  }

  async leave(id: number, jwtUser: JwtUser): Promise<Competition> {
    const competition = await this.competitionService.findOne(id);

    if (!competition.isOpen) throw new BadRequestException('Cannot leave closed competition');

    const isInCompetition = competition.users.find((value: User, index: number, obj: User[]) => {
      return (value.id = jwtUser.sub);
    });

    if (!isInCompetition) throw new BadRequestException('User not in competition');

    const userToRemove = await this.userService.findOne(jwtUser.sub);

    competition.users = competition.users.filter((user: User) => {
      return user.id !== userToRemove.id;
    });

    return competition.save();
  }

  async add(id: number, dtoUser: UserDto): Promise<Competition> {
    const competition = await this.competitionService.findOne(id);

    if (!competition.isActive) throw new BadRequestException('Competition no longer active');

    if (!competition.isOpen) throw new BadRequestException('Cannot add user to closed competition');

    const alreadyJoined = competition.users.find((value: User, index: number, obj: User[]) => {
      return (value.id = dtoUser.id);
    });

    if (alreadyJoined) throw new BadRequestException('Already joined competition');

    const user = await this.userService.findOne(dtoUser.id);

    competition.users.push(user);

    return competition.save();
  }

  async remove(id: number, dtoUser: UserDto): Promise<Competition> {
    const competition = await this.competitionService.findOne(id);

    if (!competition.isOpen) throw new BadRequestException('Cannot remove user from closed competition');

    const isInCompetition = competition.users.find((value: User, index: number, obj: User[]) => {
      return (value.id = dtoUser.id);
    });

    if (!isInCompetition) throw new BadRequestException('User not in competition');

    const userToRemove = await this.userService.findOne(dtoUser.id);

    competition.users = competition.users.filter((user: User) => {
      return user.id !== userToRemove.id;
    });

    return competition.save();
  }
}
