// src/api/medical-record/medical-record.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { formatResponse } from '../../common/utils/response.util';

@Injectable()
export class MedicalRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(doctorId: string, createMedicalRecordDto: CreateMedicalRecordDto) {
    const { patientId, recordType, details, files, price, paymentStatus } = createMedicalRecordDto;

    const medicalRecord = await this.prisma.medicalRecord.create({
      data: {
        patientId,
        doctorId,
        recordType,
        details,
        files,
        price,
        paymentStatus,
      },
    });

    return formatResponse('Medical record created successfully', medicalRecord);
  }

  async findAll() {
    const medicalRecords = await this.prisma.medicalRecord.findMany();
    return formatResponse('All medical records retrieved successfully', medicalRecords);
  }

  async findOne(id: string) {
    const medicalRecord = await this.prisma.medicalRecord.findUnique({
      where: { id },
    });
    if (!medicalRecord) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
    return formatResponse('Medical record retrieved successfully', medicalRecord);
  }

  async update(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    const medicalRecord = await this.prisma.medicalRecord.update({
      where: { id },
      data: updateMedicalRecordDto,
    });
    return formatResponse('Medical record updated successfully', medicalRecord);
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure the medical record exists before deletion
    await this.prisma.medicalRecord.delete({
      where: { id },
    });
    return formatResponse('Medical record deleted successfully', null);
  }

  async findMedicalRecordsForUser(userId: string) {
    const records = await this.prisma.medicalRecord.findMany({
      where: { patientId: userId },
    });
    return formatResponse('Medical records retrieved successfully', records);
  }

  async findMedicalRecordsForDoctor(doctorId: string) {
    const records = await this.prisma.medicalRecord.findMany({
      where: { doctorId: doctorId },
    });
    return formatResponse('Medical records retrieved successfully', records);
  }

  async updateByDoctor(doctorId: string, id: string, updateDto: UpdateMedicalRecordDto) {
    const existingRecord = await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: { doctor: true } // Ensure the doctor relationship is loaded to check ownership
    });

    if (!existingRecord) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }

    if (existingRecord.doctorId !== doctorId) {
      throw new UnauthorizedException('You are not authorized to update this medical record');
    }

    const updatedRecord = await this.prisma.medicalRecord.update({
      where: { id },
      data: updateDto,
    });

    return formatResponse('Medical record updated successfully', updatedRecord);
  }

  async deleteByDoctor(doctorId: string, id: string) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id }
    });

    if (!record) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }

    if (record.doctorId !== doctorId) {
      throw new UnauthorizedException('You are not authorized to delete this medical record');
    }

    await this.prisma.medicalRecord.delete({
      where: { id },
    });

    return formatResponse('Medical record deleted successfully', null);
  }
}
