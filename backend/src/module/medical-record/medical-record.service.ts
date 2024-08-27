// src/api/medical-record/medical-record.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto) {
    const { patientId, recordType, details, files } = createMedicalRecordDto;
  
    return this.prisma.medicalRecord.create({
      data: {
        patientId,
        recordType,
        details,
        files: files || [], // Ensure that files are an empty array if not provided
      },
    });
  }
  

  async findAll() {
    return this.prisma.medicalRecord.findMany();
  }

  async findOne(id: string) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundException(`MedicalRecord with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.prisma.medicalRecord.update({
      where: { id },
      data: updateMedicalRecordDto,
    });
  }

  async remove(id: string) {
    return this.prisma.medicalRecord.delete({
      where: { id },
    });
  }
}
