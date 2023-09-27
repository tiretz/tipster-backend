import { Controller, Post, Body, Param, ParseIntPipe, BadRequestException, Req } from '@nestjs/common';
import { CompetitionActionService } from './competition-action.service';
import { CheckPolicies } from 'src/common/decorators/policy.decorator';
import { AppAbility } from 'src/ability/types/appability.type';
import { Action } from 'src/ability/enums/action.enum';
import { Competition } from 'src/competition/entities/competition.entity';
import { UserDto } from 'src/competition/dto/user.dto';
import { JwtUser } from 'src/auth/types/jwtUser';
import { Request } from 'express';

@Controller('competitions/:id')
export class CompetitionActionController {
  constructor(private readonly competitionActionService: CompetitionActionService) {}

  @Post('join')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async join(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Competition> {
    const user = req.user as JwtUser;

    if (!user) throw new BadRequestException();

    return this.competitionActionService.join(id, user);
  }

  @Post('leave')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async leave(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Competition> {
    const user = req.user as JwtUser;

    if (!user) throw new BadRequestException();

    return this.competitionActionService.leave(id, user);
  }

  @Post('add')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Competition))
  async add(@Param('id', ParseIntPipe) id: number, @Body() user: UserDto): Promise<Competition> {
    return this.competitionActionService.add(id, user);
  }

  @Post('remove')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Competition))
  async remove(@Param('id', ParseIntPipe) id: number, @Body() user: UserDto): Promise<Competition> {
    return this.competitionActionService.remove(id, user);
  }
}
