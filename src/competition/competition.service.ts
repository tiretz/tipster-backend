import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { JwtUser } from 'src/auth/types/jwtUser';
import { Competition } from './entities/competition.entity';
import { CompetitionRepository } from './repositories/competition.repository';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { In } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class CompetitionService {
  constructor(
    private competitionRepository: CompetitionRepository,
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  async create(createCompetitionDto: CreateCompetitionDto): Promise<Competition> {
    const users = createCompetitionDto.users
      ? await this.userRepository.find({
          where: {
            id: In(
              createCompetitionDto.users.map((value: UserDto, index: number, array: UserDto[]) => {
                return value.id;
              }),
            ),
          },
        })
      : undefined;

    const newCompetition = this.competitionRepository.create({
      country: createCompetitionDto.country,
      date: createCompetitionDto.date,
      info: createCompetitionDto.info,
      isActive: createCompetitionDto.isActive,
      isOpen: createCompetitionDto.isOpen,
      name: createCompetitionDto.name,
      users,
    });

    return newCompetition.save();
  }

  async findAll(): Promise<Competition[]> {
    return this.competitionRepository.find();
  }

  async findOne(id: number): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({
      where: { id },
      relations: {
        users: true,
      },
    });

    if (!competition) throw new NotFoundException(`Competition with id ${id} not found`);

    return competition;
  }

  async update(id: number, updateCompetitionDto: UpdateCompetitionDto): Promise<Competition> {
    const competition = await this.findOne(id);

    competition.country = updateCompetitionDto.country || undefined;
    competition.date = updateCompetitionDto.date || undefined;
    competition.info = updateCompetitionDto.info || undefined;
    competition.isActive = typeof updateCompetitionDto.isActive === 'boolean' ? updateCompetitionDto.isActive : undefined;
    competition.isOpen = typeof updateCompetitionDto.isOpen === 'boolean' ? updateCompetitionDto.isOpen : undefined;
    competition.name = updateCompetitionDto.name || undefined;

    const users = updateCompetitionDto.users
      ? await this.userRepository.find({
          where: {
            id: In(
              updateCompetitionDto.users.map((value: UserDto, index: number, array: UserDto[]) => {
                return value.id;
              }),
            ),
          },
        })
      : undefined;

    competition.users = users;

    return competition.save();
  }

  async delete(id: number): Promise<Competition> {
    const competition = await this.findOne(id);

    return this.competitionRepository.remove(competition);
  }

  async join(id: number, jwtUser: JwtUser): Promise<Competition> {
    const competition = await this.findOne(id);

    if (!competition.isActive) throw new BadRequestException('Competition no longer active');

    const alreadyJoined = competition.users.find((value: User, index: number, obj: User[]) => {
      return (value.id = jwtUser.sub);
    });

    if (alreadyJoined) throw new BadRequestException('Already joined competition');

    const user = await this.userService.findOne(jwtUser.sub);

    competition.users.push(user);

    return competition.save();
  }

  async leave(id: number, jwtUser: JwtUser): Promise<Competition> {
    const competition = await this.findOne(id);

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
    const competition = await this.findOne(id);

    if (!competition.isActive) throw new BadRequestException('Competition no longer active');

    const alreadyJoined = competition.users.find((value: User, index: number, obj: User[]) => {
      return (value.id = dtoUser.id);
    });

    if (alreadyJoined) throw new BadRequestException('Already joined competition');

    const user = await this.userService.findOne(dtoUser.id);

    competition.users.push(user);

    return competition.save();
  }

  async remove(id: number, dtoUser: UserDto): Promise<Competition> {
    const competition = await this.findOne(id);

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
