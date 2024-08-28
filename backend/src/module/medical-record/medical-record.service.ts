import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { formatResponse } from "src/common/utils/response.util";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";

@Injectable()
export class MedicalRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto) {
    const { patientId, recordType, details, files } = createMedicalRecordDto;

    const record = await this.prisma.medicalRecord.create({
      data: {
        patient: {
          connect: { id: patientId }, // connect the patient by ID
        },
        recordType,
        details,
        files,
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

    return !!record;
  }
}
