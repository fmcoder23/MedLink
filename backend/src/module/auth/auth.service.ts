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

    // Check if the phone number already exists
    const existingUser = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (existingUser) {
      throw new ConflictException('Phone number already exists');
    }

    // Hash the password before storing it
    const hashedPassword = await hash(password, 12);

    // Create the new user with the default role set to 'USER'
    const user = await this.prisma.user.create({
      data: {
        fullname,
        phoneNumber,
        password: hashedPassword,
        role: 'USER', // Set the default role to USER
        photo,
      },
    });

    // Generate a JWT token for the user
    const token = this.jwt.sign({ id: user.id, role: user.role });

    return {
      message: 'User registered successfully',
      token,
      data: user,
    };
  }

  async login(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto;

    // Find the user by phone number
    const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      throw new UnauthorizedException('Incorrect phone number or password');
    }

    // Compare the provided password with the stored hashed password
    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect phone number or password');
    }

    // Generate a JWT token for the user
    const token = this.jwt.sign({ id: user.id, role: user.role });

    return {
      message: 'User successfully logged in',
      token,
      data: user,
    };
  }

  async adminLogin(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto;

    // Find the user by phone number
    const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('User is not an admin');
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    // Generate a JWT token for the user
    const token = this.jwt.sign({ id: user.id, role: user.role });

    return { user, token };
  }
}
