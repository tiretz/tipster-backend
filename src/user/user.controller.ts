import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { hashData } from 'src/utils/hashing';
import { CheckPolicies } from 'src/common/decorators/policy.decorator';
import { AppAbility } from 'src/ability/types/appability.type';
import { Action } from 'src/ability/enums/action.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = req.user as User;

    if (!user) throw new BadRequestException();

    const ability = this.abilityFactory.defineAbility(user);

    const userToUpdateFromDb = await this.userService.findOne(id);

    if (!userToUpdateFromDb)
      throw new BadRequestException('User to update does not exists!');

    const userToUpdate = new User(
      userToUpdateFromDb.id,
      userToUpdateFromDb.email,
      userToUpdateFromDb.role,
    );

    const isAllowed = ability.can(Action.Update, userToUpdate);

    if (!isAllowed) throw new ForbiddenException('Insufficient rights!');

    if (updateUserDto.password)
      updateUserDto.password = await hashData(updateUserDto.password);

    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    const user = req.user as User;

    if (!user) throw new BadRequestException();

    const ability = this.abilityFactory.defineAbility(user);

    const userToDeleteFromDb = await this.userService.findOne(id);

    if (!userToDeleteFromDb)
      throw new BadRequestException('User to delete does not exists!');

    const userToDelete = new User(
      userToDeleteFromDb.id,
      userToDeleteFromDb.email,
      userToDeleteFromDb.role,
    );

    const isAllowed = ability.can(Action.Delete, userToDelete);

    if (!isAllowed) throw new ForbiddenException('Insufficient rights!');

    return this.userService.delete(id);
  }
}
