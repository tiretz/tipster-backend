import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtAccessSecret } from '../utils/constants';
import { SigninDto } from './dto/signin.dto';
import { Tokens } from './types/token.type';
import { SignupDto } from './dto/signup.dto';
import { Role } from '@prisma/client';
import { hashData } from 'src/utils/hashing';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signupLocal(dto: SignupDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) throw new BadRequestException('User already exists!');

    const hash = await hashData(dto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hash,
      },
    });

    const tokens = await this.getToken(newUser.id, newUser.email, newUser.role);

    await this.prismaService.user.update({
      where: {
        email: dto.email,
      },
      data: {
        jwt: tokens.access_token,
      },
    });

    return tokens;
  }

  async signinLocal(dto: SigninDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new BadRequestException('Invalid email or password!');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches)
      throw new BadRequestException('Invalid email or password!');

    const tokens = await this.getToken(user.id, user.email, user.role);

    await this.prismaService.user.update({
      where: {
        email: dto.email,
      },
      data: {
        jwt: tokens.access_token,
      },
    });

    return tokens;
  }

  async logout(userId: number) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        jwt: {
          not: null,
        },
      },
      data: {
        jwt: null,
      },
    });
  }

  private async getToken(
    userID: number,
    email: string,
    role: Role,
  ): Promise<Tokens> {
    const at = await this.jwtService.signAsync(
      {
        sub: userID,
        email,
        role,
      },
      {
        secret: jwtAccessSecret,
        expiresIn: 60 * 60 * 24 * 7, // 1 week
      },
    );

    return {
      access_token: at,
    };
  }
}
