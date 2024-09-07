import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({
      data: {
        name: createCityDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.city.findMany({
        include: {
            specializations: true,
            doctors: {
                select: {
                    id: true,
                    fullname: true,
                    specializations: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    }).then(cities => cities.map(city => ({
        ...city,
        totalCountOfDoctors: city.doctors.length,
        doctors: city.doctors.map(doctor => ({
            id: doctor.id,
            fullname: doctor.fullname,
            specializations: doctor.specializations.map(spec => spec.name),
        })),
    })));
}


  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        specializations: true,
        doctors: true,
      },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    return this.prisma.city.update({
      where: { id },
      data: {
        name: updateCityDto.name,
      },
    });
  }

  async remove(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return this.prisma.city.delete({
      where: { id },
    });
  }
}
