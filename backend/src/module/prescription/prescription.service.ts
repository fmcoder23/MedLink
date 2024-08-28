// src/api/prescription/prescription.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { formatResponse } from 'src/common/utils/response.util';

@Injectable()
export class PrescriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    const prescription = await this.prisma.prescription.create({
      data: createPrescriptionDto,
    });

    return formatResponse('Prescription created successfully', prescription);
  }

  async findAll() {
    const prescriptions = await this.prisma.prescription.findMany();
    return formatResponse('All prescriptions retrieved successfully', prescriptions);
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return formatResponse('Prescription retrieved successfully', prescription);
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    const prescription = await this.prisma.prescription.update({
      where: { id },
      data: updatePrescriptionDto,
    });

    return formatResponse('Prescription updated successfully', prescription);
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure the prescription exists before deletion

    await this.prisma.prescription.delete({
      where: { id },
    });

    return formatResponse('Prescription deleted successfully', null);
  }
}
