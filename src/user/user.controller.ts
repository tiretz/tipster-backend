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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { hashData } from 'src/utils/hashing';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const user = req.user as User;

    if (!user) throw new BadRequestException();

    const ability = this.abilityFactory.defineAbility(user);

    const isAllowed = ability.can(Action.Create, User);

    if (!isAllowed) throw new ForbiddenException('Insufficient rights!');

    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as User;

    if (!user) throw new BadRequestException();

    const ability = this.abilityFactory.defineAbility(user);

    const isAllowed = ability.can(Action.Read, User);

    if (!isAllowed) throw new ForbiddenException('Insufficient rights!');

    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as User;

    if (!user) throw new BadRequestException();

    const ability = this.abilityFactory.defineAbility(user);

    const isAllowed = ability.can(Action.Read, User);

    if (!isAllowed) throw new ForbiddenException('Insufficient rights!');

    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = req.user as User;

    if (!user) throw new BadRequestException();

    const ability = this.abilityFactory.defineAbility(user);

    const userToUpdateFromDb = await this.userService.findOne(+id);

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

    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as User;

    if (!user) throw new BadRequestException();

    const ability = this.abilityFactory.defineAbility(user);

    const userToDeleteFromDb = await this.userService.findOne(+id);

    if (!userToDeleteFromDb)
      throw new BadRequestException('User to delete does not exists!');

    const userToDelete = new User(
      userToDeleteFromDb.id,
      userToDeleteFromDb.email,
      userToDeleteFromDb.role,
    );

    const isAllowed = ability.can(Action.Delete, userToDelete);

    if (!isAllowed) throw new ForbiddenException('Insufficient rights!');

    return await this.userService.remove(+id);
  }
}
