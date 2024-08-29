import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { formatResponse } from 'src/common/utils/response.util';
import { UserRole } from 'src/common/enums/role.enum';

@Injectable()
export class MedicalRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto) {
    const { patientId, recordType, details, files, price, paymentStatus } = createMedicalRecordDto;

        const record = await this.prisma.medicalRecord.create({
            data: {
                patient: { connect: { id: patientId } },
                recordType,
                details,
                files,
                price,
                paymentStatus,
            },
        });

    return formatResponse('Medical record created successfully', record);
  }

  async findAll() {
    const records = await this.prisma.medicalRecord.findMany();
    return formatResponse('All medical records retrieved successfully', records);
  }

  async findOne(id: string, user: any) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`MedicalRecord with ID ${id} not found`);
    }

    if (
      (user.role === UserRole.USER && record.patientId !== user.id) ||
      (user.role === UserRole.DOCTOR && !(await this.isDoctorRelatedToRecord(user.id, record.id)))
    ) {
      throw new ForbiddenException('You do not have access to this medical record');
    }
        // Ensure only authorized users can access the record
        if (
            (user.role === UserRole.USER && record.patientId !== user.id) ||
            (user.role === UserRole.DOCTOR && !(await this.isDoctorRelatedToRecord(user.id, record.patientId)))
        ) {
            throw new ForbiddenException('You do not have access to this medical record');
        }

    return formatResponse('Medical record retrieved successfully', record);
  }

  async update(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException(`MedicalRecord with ID ${id} not found`);
    }

    const updatedRecord = await this.prisma.medicalRecord.update({
      where: { id },
      data: updateMedicalRecordDto,
    });
        const updatedRecord = await this.prisma.medicalRecord.update({
            where: { id },
            data: {
                ...updateMedicalRecordDto,
            },
        });

    return formatResponse('Medical record updated successfully', updatedRecord);
  }

  async remove(id: string) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException(`MedicalRecord with ID ${id} not found`);
    }

    await this.prisma.medicalRecord.delete({ where: { id } });

    return formatResponse('Medical record deleted successfully', null);
  }

  private async isDoctorRelatedToRecord(doctorId: string, recordId: string): Promise<boolean> {
    const record = await this.prisma.medicalRecord.findFirst({
      where: {
        id: recordId,
        // Add conditions that define the relationship between doctor and record
      },
    });
    private async isDoctorRelatedToRecord(doctorId: string, patientId: string): Promise<boolean> {
        // Implement logic to check if the doctor is related to the patient
        const patient = await this.prisma.appointment.findFirst({
            where: {
                doctorId,
                patientId,
            },
        });

    return !!record;
  }
}
