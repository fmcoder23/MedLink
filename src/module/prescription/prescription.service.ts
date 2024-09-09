// src/api/prescription/prescription.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { formatResponse } from 'src/common/utils/response.util';

@Injectable()
export class PrescriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(doctorId: string, createPrescriptionDto: CreatePrescriptionDto) {
    const prescription = await this.prisma.prescription.create({
      data: {
        ...createPrescriptionDto,
        doctorId, // Use doctorId from token
      },
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
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
    await this.prisma.prescription.delete({
      where: { id },
    });
    return formatResponse('Prescription deleted successfully', null);
  }

  async findPrescriptionsForUser(userId: string) {
    const prescriptions = await this.prisma.prescription.findMany({
      where: { patientId: userId }, // Filter by userId (patient)
    });
    return formatResponse('Prescriptions for user retrieved successfully', prescriptions);
  }

  async findPrescriptionsForDoctor(doctorId: string) {
    const prescriptions = await this.prisma.prescription.findMany({
      where: { doctorId }, // Filter by doctorId
    });
    return formatResponse('Prescriptions for doctor retrieved successfully', prescriptions);
  }

  async updateByDoctor(doctorId: string, id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (prescription.doctorId !== doctorId) {
      throw new UnauthorizedException(`You are not allowed to update this prescription`);
    }

    const updatedPrescription = await this.prisma.prescription.update({
      where: { id },
      data: updatePrescriptionDto,
    });

    return formatResponse('Prescription updated successfully', updatedPrescription);
  }

  async deleteByDoctor(doctorId: string, id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    if (prescription.doctorId !== doctorId) {
      throw new UnauthorizedException(`You are not allowed to delete this prescription`);
    }

    await this.prisma.prescription.delete({
      where: { id },
    });

    return formatResponse('Prescription deleted successfully', null);
  }
}
