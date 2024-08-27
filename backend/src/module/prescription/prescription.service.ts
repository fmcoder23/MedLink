// src/api/prescription/prescription.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    return this.prisma.prescription.create({
      data: createPrescriptionDto,
    });
  }

  async findAll() {
    return this.prisma.prescription.findMany();
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
    return prescription;
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prisma.prescription.update({
      where: { id },
      data: updatePrescriptionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.prescription.delete({
      where: { id },
    });
  }
}
