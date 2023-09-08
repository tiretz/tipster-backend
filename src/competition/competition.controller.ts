import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { Action, AppAbility } from 'src/ability/ability.factory';
import { CheckPolicies } from 'src/common/decorators/policy.decorator';
import { Competition } from './entities/competition.entity';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';
import { JwtUser } from 'src/auth/types/jwtUser';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Competition),
  )
  async create(@Body() createCompetitionDto: CreateCompetitionDto) {
    return await this.competitionService.create(createCompetitionDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async findAll() {
    return await this.competitionService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async findOne(@Param('id') id: string) {
    return await this.competitionService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Competition),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return await this.competitionService.update(+id, updateCompetitionDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Competition),
  )
  async remove(@Param('id') id: string) {
    return await this.competitionService.remove(+id);
  }

  @Post('join/:id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async join(@Req() req: Request, @Param('id') id: number) {
    const user = req.user as JwtUser;

    if (!user) throw new BadRequestException();

    return await this.competitionService.join(user, id);
  }

  @Post('leave/:id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async leave(@Req() req: Request, @Param('id') id: number) {
    const user = req.user as JwtUser;

    if (!user) throw new BadRequestException();

    return await this.competitionService.leave(user, id);
  }
}
