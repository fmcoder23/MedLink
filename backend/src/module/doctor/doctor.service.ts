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
  ) { }

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
  
    const reviewStats = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      where: {
        doctorId: doctor.id,
      },
    });
  
    const doctorWithRating = {
      ...doctor,
      avgRating: reviewStats._avg.rating || 0,
      totalReviews: reviewStats._count.rating || 0,
    };
  
    return doctorWithRating;
  }
  

  async create(createDoctorDto: CreateDoctorDto) {
    const { password, phoneNumber, email, location, cityId, specializationIds, ...rest } = createDoctorDto;
  
    // Check if a doctor with the same phone number or email already exists
    const existingDoctor = await this.prisma.doctor.findFirst({
      where: {
        OR: [{ phoneNumber }, { email }],
      },
    });
  
    if (existingDoctor) {
      throw new ConflictException('Phone number or email already exists');
    }
  
    // Hash the password before storing it
    const hashedPassword = await hash(password, 12);
  
    // Resolve specialization IDs and create any missing specializations in the specified city
    const specializationConnections = await Promise.all(
      specializationIds.map(async (idOrName) => {
        // Check if the input is a UUID or a name (string)
        const isUuid = /^[0-9a-fA-F-]{36}$/.test(idOrName);
  
        if (isUuid) {
          // Attempt to find the specialization by UUID
          const specialization = await this.prisma.specialization.findUnique({
            where: { id: idOrName },
          });
  
          if (specialization) {
            return { id: specialization.id };
          } else {
            throw new NotFoundException(`Specialization with ID ${idOrName} not found.`);
          }
        } else {
          // Attempt to find the specialization by name within the city
          let specialization = await this.prisma.specialization.findFirst({
            where: {
              name: idOrName,
              cityId,
            },
          });
  
          if (!specialization) {
            // If not found, create the specialization in the specified city
            specialization = await this.prisma.specialization.create({
              data: {
                name: idOrName,
                city: {
                  connect: { id: cityId },
                },
              },
            });
          }
  
          return { id: specialization.id };
        }
      })
    );
  
    // Create the doctor with related specializations and city
    const doctor = await this.prisma.doctor.create({
      data: {
        ...rest,
        phoneNumber,
        email,
        password: hashedPassword,
        location: JSON.stringify(location),
        city: {
          connect: { id: cityId },
        },
        specializations: {
          connect: specializationConnections, // Connect the doctor to the specializations
        },
      },
      include: {
        city: true,
        specializations: true,
      },
    });
  
    return formatResponse('Doctor created successfully', doctor);
  }
  
  
  
  async getSpecializationNames(specializationIds: string[]): Promise<string[]> {
    // Fetch the specializations based on the provided IDs
    const specializations = await this.prisma.specialization.findMany({
      where: {
        id: { in: specializationIds },
      },
      select: {
        name: true,
      },
    });
  
    // Extract and return the names of the specializations
    return specializations.map(specialization => specialization.name);
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

  async findAll(query: { regionId?: string; specialization?: string; limit?: number; page?: number; sortBy?: string }) {
    const { regionId, specialization, limit = 10, page = 1, sortBy } = query;
    const skip = (page - 1) * limit;
  
    // Build the filter conditions
    const whereConditions: any = {};
    if (regionId) {
      whereConditions.cityId = regionId; // Assuming regionId is the cityId
    }
    if (specialization) {
      whereConditions.specializations = {
        some: {
          name: specialization, // Prisma uses 'some' for filtering many-to-many relations
        },
      };
    }
  
    // Fetch doctors with their specializations, excluding reviews for now
    let doctors = await this.prisma.doctor.findMany({
      where: whereConditions,
      include: {
        specializations: {
          select: {
            name: true,
          },
        },
      },
      skip: skip,
      take: Number(limit),
    });
  
    // Count total number of doctors matching the filter conditions
    let totalCount = await this.prisma.doctor.count({
      where: whereConditions,
    });
  
    // Calculate average rating and total review count for each doctor
    const doctorsWithAverageRating = await Promise.all(
      doctors.map(async (doctor) => {
        const reviewStats = await this.prisma.review.aggregate({
          _avg: {
            rating: true,
          },
          _count: {
            rating: true, // Count the total number of reviews
          },
          where: {
            doctorId: doctor.id,
          },
        });
        return {
          ...doctor,
          avgRating: reviewStats._avg.rating || 0,
          totalReviews: reviewStats._count.rating || 0, // Total count of reviews
        };
      })
    );
  
    if (sortBy === 'top-rated') {
      // Sort doctors by average rating in descending order
      doctorsWithAverageRating.sort((a, b) => b.avgRating - a.avgRating);
    }
  
    return formatResponse('Doctors retrieved successfully', {
      doctors: doctorsWithAverageRating.map(doctor => ({
        id: doctor.id,
        fullname: doctor.fullname,
        specializations: doctor.specializations.map(spec => spec.name),
        avgRating: doctor.avgRating,
        totalReviews: doctor.totalReviews,
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
}

  
  async findDoctorsByCityAndCategory(cityName: string, categoryName: string) {
    // First, find the city by name
    const city = await this.prisma.city.findUnique({
      where: { name: cityName },
      include: {
        specializations: {
          where: { name: categoryName },
        },
      },
    });
  
    if (!city) {
      throw new NotFoundException('City not found');
    }
  
    // Fetch specializations with matching category name in the city
    const specialization = await this.prisma.specialization.findFirst({
      where: {
        name: categoryName,
        cityId: city.id,
      },
      include: {
        doctors: {
          include: {
            prescriptions: true,
            appointments: true,
            reviews: true,
          },
        },
      },
    });
  
    if (!specialization || specialization.doctors.length === 0) {
      return formatResponse(`No doctors found in ${cityName} for category ${categoryName}`, []);
    }
  
    return formatResponse(`Doctors in ${cityName} for category ${categoryName} retrieved successfully`, specialization.doctors);
  }
  
  
  // async getAllCitiesWithSpecializations() {
  //   const cities = await this.prisma.city.findMany({
  //     include: {
  //       doctors: {
  //         select: {
  //           specialization: true,
  //         },
  //       },
  //     },
  //   });

  //   // Format the data to group specializations by city
  //   const result = cities.map(city => {
  //     const specializations = city.doctors.reduce((acc, doctor) => {
  //       doctor.specialization.forEach(spec => {
  //         if (!acc.includes(spec)) {
  //           acc.push(spec);
  //         }
  //       });
  //       return acc;
  //     }, []);

  //     return {
  //       id: city.id,
  //       name: city.name,
  //       specializations,
  //     };
  //   });

  //   return formatResponse('Cities with doctor specializations retrieved successfully', result);
  // }

  async updateMe(doctorId: string, updateDoctorDto: UpdateDoctorDto) {
    const { password, location, ...rest } = updateDoctorDto;
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

    const { location,  ...rest } = updateDoctorDto;

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data: {
        ...rest,
        location: JSON.stringify(location),
      
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
}
