import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { formatResponse } from 'src/common/utils/response.util';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateMe(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    const data: Partial<UpdateUserDto & { password?: string }> = rest;

    if (password) {
      data.password = await hash(password, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return formatResponse("User's details updated successfully", updatedUser);
  }

  async findCurrentUser(userId: string) {
    const user = await this.findUserById(userId);
    return formatResponse('Current user details retrieved successfully', user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return formatResponse('All users retrieved successfully', users);
  }

  async findOne(id: string) {
    const user = await this.findUserById(id);
    return formatResponse('User retrieved successfully', user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findUserById(id);

    const data: Partial<UpdateUserDto & { password?: string }> = updateUserDto;
    if (updateUserDto.password) {
      data.password = await hash(updateUserDto.password, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return formatResponse('User updated successfully', updatedUser);
  }

  async remove(id: string) {
    await this.findUserById(id);

    await this.prisma.user.delete({ where: { id } });
    return formatResponse('User deleted successfully', null);
  }
}
