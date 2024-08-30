import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
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
    private readonly jwtService: JwtService,
  ) {}

  private async findDoctorById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        prescriptions: true,
        appointments: true,
        reviews: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const { password, phoneNumber, email, location, region, ...rest } = createDoctorDto;

    const existingDoctor = await this.prisma.doctor.findFirst({
      where: {
        OR: [{ phoneNumber }, { email }],
      },
    });

    if (existingDoctor) {
      throw new ConflictException('Phone number or email already exists');
    }

    const hashedPassword = await hash(password, 12);
    const doctor = await this.prisma.doctor.create({
      data: {
        ...rest,
        phoneNumber,
        email,
        password: hashedPassword,
        location: JSON.stringify(location),
        region,
      },
    });

    return formatResponse('Doctor created successfully', doctor);
  }

  async login(doctorLoginDto: DoctorLoginDto) {
    const { phoneNumber, password } = doctorLoginDto;
    const doctor = await this.prisma.doctor.findUnique({
      where: { phoneNumber },
    });

    if (!doctor || !(await compare(password, doctor.password))) {
      throw new UnauthorizedException('Incorrect phone or password');
    }

    const token = this.jwtService.sign({ id: doctor.id, role: UserRole.DOCTOR });
    return formatResponse('Doctor successfully logged in', {
      token,
      doctor,
    });
  }

  async findCurrentDoctor(doctorId: string) {
    const doctor = await this.findDoctorById(doctorId);
    return formatResponse('Current doctor details retrieved successfully', doctor);
  }

  async findOne(id: string) {
    const doctor = await this.findDoctorById(id);
    return formatResponse('Doctor retrieved successfully', doctor);
  }

  async findAll() {
    const [doctors, totalCount] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        include: {
          prescriptions: true,
          appointments: true,
          reviews: true,
        },
      }),
      this.prisma.doctor.count(),
    ]);

    return formatResponse('All doctors retrieved successfully', { doctors, totalCount });
  }

  async findByRegion(region: string) {
    const [doctors, totalCount] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where: { region },
        include: {
          prescriptions: true,
          appointments: true,
          reviews: true,
        },
      }),
      this.prisma.doctor.count({
        where: { region },
      }),
    ]);

    return formatResponse(`Doctors in region "${region}" retrieved successfully`, { doctors, totalCount });
  }

  async updateMe(doctorId: string, updateDoctorDto: UpdateDoctorDto) {
    const { password, location, region, ...rest } = updateDoctorDto;
    let hashedPassword: string;
    if (password) {
      hashedPassword = await hash(password, 12);
    }
    const doctor = await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        password: hashedPassword,
        ...rest,
        location: JSON.stringify(location),
        region,
      },
      include: {
        prescriptions: true,
        appointments: true,
        reviews: true,
      },
    });
    return formatResponse("Doctor's details updated successfully", doctor);
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    await this.findDoctorById(id);

    const { location, region, ...rest } = updateDoctorDto;

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data: {
        ...rest,
        location: JSON.stringify(location),
        region,
      },
      include: {
        prescriptions: true,
        appointments: true,
        reviews: true,
      },
    });

    return formatResponse('Doctor updated successfully', updatedDoctor);
  }

  async remove(id: string) {
    await this.findDoctorById(id);

    await this.prisma.doctor.delete({ where: { id } });

    return formatResponse('Doctor deleted successfully', null);
  }



async findTopRatedDoctors(limit: number) {
  const doctors = await this.prisma.doctor.findMany({
    include: {
      reviews: true,
    },
  });

  const doctorsWithAverageRating = doctors.map(doctor => {
    const avgRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0) / doctor.reviews.length || 0;
    return {
      ...doctor,
      avgRating,
    };
  });

  const sortedDoctors = doctorsWithAverageRating.sort((a, b) => b.avgRating - a.avgRating).slice(0, limit);

  return formatResponse("Top doctors retrieved successfully", sortedDoctors);
}


async findTopSpecialties(limit: number) {
  const specialties = await this.prisma.$queryRaw<
    Array<{ specialization: string; searchCount: number }>
  >`
    SELECT specialization, SUM("searchCount") as "searchCount"
    FROM "Doctor"
    GROUP BY specialization
    ORDER BY "searchCount" DESC
    LIMIT ${limit};
  `;

  return formatResponse("Top specialties retrieved successfully", specialties);
}
}













  

