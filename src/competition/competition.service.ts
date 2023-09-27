import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { Competition } from './entities/competition.entity';
import { CompetitionRepository } from './repositories/competition.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { In } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { CompetitionConfigRepository } from 'src/competition-config/repositories/competition-config.repository';

@Injectable()
export class CompetitionService {
  constructor(
    private competitionRepository: CompetitionRepository,
    private competitionConfigRepository: CompetitionConfigRepository,
    private userRepository: UserRepository,
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

    const newCompetitionConfig = this.competitionConfigRepository.create({});

    await newCompetitionConfig.save();

    const newCompetition = this.competitionRepository.create({
      country: createCompetitionDto.country,
      date: createCompetitionDto.date,
      info: createCompetitionDto.info,
      isActive: createCompetitionDto.isActive,
      isOpen: createCompetitionDto.isOpen,
      name: createCompetitionDto.name,
      users,
      config: newCompetitionConfig,
    });

    return newCompetition.save();
  }

  async findAll(): Promise<Competition[]> {
    return this.competitionRepository.find({
      relations: {
        users: true,
        config: true,
      },
    });
  }

  async findOne(id: number): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({
      where: { id },
      relations: {
        users: true,
        config: true,
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
}
