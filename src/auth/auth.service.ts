import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { Tokens } from './types/token';
import { SignupDto } from './dto/signup.dto';
import { hashData } from 'src/utils/hashing';
import { UserRepository } from 'src/user/repositories/user.repository';
import { IsNull, Not } from 'typeorm';
import { UserRole } from 'src/user/enums/role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signupLocal(dto: SignupDto): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (user) throw new BadRequestException('User already exists!');

    const hash = await hashData(dto.password);

    const newUser = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: hash,
    });

    const tokens = await this.getToken(newUser.id, newUser.email, newUser.role);

    newUser.jwt = tokens.access_token;

    await newUser.save();

    return tokens;
  }

  async signinLocal(dto: SigninDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      select: {
        email: true,
        id: true,
        role: true,
        password: true,
      },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) throw new BadRequestException('Invalid credentials');

    const tokens = await this.getToken(user.id, user.email, user.role);

    user.jwt = tokens.access_token;

    await user.save();

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(
      {
        id: userId,
        jwt: Not(IsNull()),
      },
      { jwt: null },
    );
  }

  private async getToken(userID: number, email: string, role: UserRole): Promise<Tokens> {
    const at = await this.jwtService.signAsync(
      {
        sub: userID,
        email,
        role,
      },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: 60 * 60 * 24 * 7, // 1 week
      },
    );

    return {
      access_token: at,
    };
  }
}
