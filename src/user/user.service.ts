import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { hashData } from 'src/utils/hashing';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) throw new BadRequestException(`User with email '${createUserDto.email}' already exists`);

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName || undefined,
      lastName: createUserDto.lastName || undefined,
      password: await hashData(createUserDto.password),
      role: createUserDto.role || undefined,
      username: createUserDto.username,
    });

    const result = await this.userRepository.insert(newUser);

    if (result.identifiers.length === 0) throw new ConflictException('Unable to create new user');

    const id = result.identifiers[0].id;

    return this.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.userRepository.update(
      {
        id,
      },
      {
        email: updateUserDto.email || undefined,
        firstName: updateUserDto.firstName || undefined,
        lastName: updateUserDto.lastName || undefined,
        password: updateUserDto.password ? await hashData(updateUserDto.password) : undefined,
        role: updateUserDto.role || undefined,
      },
    );

    if (result.affected === 0) throw new NotFoundException(`User with ID '${id}' not found`);

    return this.findOne(id);
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOne(id);

    return this.userRepository.remove(user);
  }
}
