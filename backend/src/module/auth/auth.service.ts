import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService, 
    private readonly prisma: PrismaService
  ) {}

  async register(registerDto: RegisterDto) {
    const { fullname, phoneNumber, password, photo } = registerDto;

    const existingUser = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (existingUser) {
      throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = await hash(password, 12);
    const user = await this.prisma.user.create({
      data: {
        fullname,
        phoneNumber,
        password: hashedPassword,
        photo,
      },
    });

    const token = this.jwt.sign({ id: user.id, role: user.role });

    return {
      message: 'User registered successfully',
      token,
      data: user,
    };
  }

  async login(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      throw new UnauthorizedException('Incorrect phone or password');
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect phone or password');
    }

    const token = this.jwt.sign({ id: user.id, role: user.role });

    return {
      message: 'User successfully logged in',
      token,
      data: user,
    };
  }
}
