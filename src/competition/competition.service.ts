import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtUser } from 'src/auth/types/jwtUser';

@Injectable()
export class CompetitionService {
  constructor(private prismaService: PrismaService) {}

  async create(createCompetitionDto: CreateCompetitionDto) {
    return await this.prismaService.competition.create({
      data: {
        country: createCompetitionDto.country,
        name: createCompetitionDto.name,
        date: createCompetitionDto.date,
        info: createCompetitionDto.info,
      },
      select: {
        country: true,
        id: true,
        info: true,
        name: true,
        date: true,
      },
    });
  }

  async findAll() {
    return await this.prismaService.competition.findMany({
      select: {
        country: true,
        id: true,
        info: true,
        name: true,
        date: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.competition.findMany({
      where: {
        id,
      },
      select: {
        country: true,
        id: true,
        info: true,
        name: true,
        date: true,
      },
    });
  }

  async update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    return await this.prismaService.competition.update({
      where: {
        id,
      },
      data: {
        country: updateCompetitionDto.country || undefined,
        info: updateCompetitionDto.info || undefined,
        name: updateCompetitionDto.name || undefined,
        date: updateCompetitionDto.date || undefined,
      },
      select: {
        country: true,
        id: true,
        info: true,
        name: true,
        date: true,
      },
    });
  }

  async remove(id: number) {
    return await this.prismaService.competition.delete({
      where: {
        id,
      },
    });
  }

  async join(user: JwtUser, id: number) {
    const competition = await this.prismaService.competition.findFirst({
      where: {
        id,
      },
    });

    if (!competition) throw new NotFoundException('Competition not found!');

    if (!competition.isActive)
      throw new BadRequestException('Competition no longer active!');

    const alreadyJoined = await this.prismaService.userCompetition.findFirst({
      where: {
        userId: user.sub,
        competitionId: id,
      },
    });

    if (alreadyJoined)
      throw new BadRequestException('Already joined competition!');

    return await this.prismaService.userCompetition.create({
      data: {
        competitionId: id,
        userId: user.sub,
      },
      select: {
        competition: true,
        user: false,
      },
    });
  }

  async leave(user: JwtUser, id: number) {
    const isParticipant = await this.prismaService.userCompetition.findFirst({
      where: {
        userId: user.sub,
        competitionId: id,
      },
    });

    if (!isParticipant)
      throw new BadRequestException('No participant of the competition!');

    return await this.prismaService.userCompetition.delete({
      where: {
        userId_competitionId: {
          competitionId: id,
          userId: user.sub,
        },
      },
    });
  }
}
