import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create.dto';
import { DoctorLoginDto } from './dto/login.dto';
import { UpdateDoctorDto } from './dto/update.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { formatResponse } from 'src/common/utils/response.util';
import { UserRole } from 'src/common/enums/role.enum';

@Injectable()
export class DoctorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) { }

  private async findDoctorById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const { password, phoneNumber, ...rest } = createDoctorDto;

    const existingDoctor = await this.prisma.doctor.findUnique({ where: { phoneNumber } });
    if (existingDoctor) {
      throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = await hash(password, 12);
    const doctor = await this.prisma.doctor.create({
      data: {
        ...rest,
        phoneNumber,
        password: hashedPassword,
      },
    });

    return formatResponse("Doctor created successfully", doctor);
  }

  async login(doctorLoginDto: DoctorLoginDto) {
    const { phoneNumber, password } = doctorLoginDto;
    const doctor = await this.prisma.doctor.findUnique({ where: { phoneNumber } });

    if (!doctor || !(await compare(password, doctor.password))) {
      throw new UnauthorizedException('Incorrect phone or password');
    }

    const token = this.jwt.sign({ id: doctor.id, role: UserRole.DOCTOR });
    return {
      status: 200,
      message: 'Doctor successfully logged in',
      token,
      data: doctor,
    };
  }

  async findCurrentDoctor(doctorId: string) {
    const doctor = await this.findDoctorById(doctorId);
    return formatResponse("Current doctor details retrieved successfully", doctor);
  }

  async findOne(id: string) {
    const doctor = await this.findDoctorById(id);
    return formatResponse("Doctor retrieved successfully", doctor);
  }

  async findAll() {
    const doctors = await this.prisma.doctor.findMany();
    return formatResponse("All doctors retrieved successfully", doctors);
  }

  async updateMe(doctorId: string, updateDoctorDto: UpdateDoctorDto) {
    const { password, ...rest } = updateDoctorDto;
    let hashedPassword: string;
    if (password) {
      hashedPassword = await hash(password, 12);
    }
    const doctor = await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        password: hashedPassword,
        ...rest,
      },
    });
    return formatResponse("Doctor's details updated successfully", doctor);
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    await this.findDoctorById(id);

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
    });

    return formatResponse('Doctor updated successfully', updatedDoctor);
  }

  async remove(id: string) {
    await this.findDoctorById(id);

    await this.prisma.doctor.delete({ where: { id } });

    return formatResponse('Doctor deleted successfully', []);
  }
}

